import * as WebSocket from 'ws';

import { MessageType, P2PMessage } from './messages.interface';
import { Blockchain, SignedTransaction } from '../chain/interface';

/**
 * Server configuration
 */
export interface ServerConfig {
  chain: Blockchain;
  port: number;
  knownPeers: string[];
  maxPeers: number;
  controllers: {
    newChain(msg: Blockchain): void;
    newTransaction(msg: SignedTransaction): void;
  };
}

/**
 * Broadcast methods on the server
 */
export interface ServerBroadcastMethods {
  broadcastTransaction(t: SignedTransaction): void;
  broadcastChain(): void;
}

type NewPeersFunction = (peerUrls: string[]) => void;
type MessageHandler = (msg: string) => void;

/**
 * Takes in config containing controllers for handling
 * inbound requests; returns object with methods for
 * sending outbound requests
 */
export const listen = (cfg: ServerConfig): ServerBroadcastMethods => {
  const server = new WebSocket.Server({ port: cfg.port });
  const peerSockets: WebSocket[] = [];
  let messageHandler: MessageHandler;

  const newPeersFn = (newPeers: string[]) => {
    if (peerSockets.length >= cfg.maxPeers) {
      return;
    }

    const connectedPeerUrls = peerSockets.map((ws) => ws.url);
    const newUrls = newPeers.filter((url) => !connectedPeerUrls.includes(url));

    newUrls.forEach((url) => {
      const peerSocket = new WebSocket(`ws://${url}`);

      peerSocket.on('open', () => {
        peerSocket.on('message', messageHandler);

        sendChain(peerSocket, cfg.chain);
      });

      peerSocket.on('error', (err: Error) => {
        // tslint:disable-next-line no-any
        if ((<any> err).code  === 'ECONNREFUSED') {
          console.log('Failed to connect to peer');
          setTimeout(() => newPeersFn([url]), 5000);
        }
      });

      peerSockets.push(peerSocket);
    });
  };

  messageHandler = getMessageHandler(cfg, newPeersFn);

  // when a peer connects inbound
  server.on('connection', (ws: WebSocket) => {
    ws.on('message', messageHandler);

    sendChain(ws, cfg.chain);

    broadcastMessage([ws], { data: peerSockets.map((s) => s.url), type: MessageType.peers });

    peerSockets.push(ws);
  });

  // connect to known peers on startup
  newPeersFn(cfg.knownPeers);

  // return the outbound API
  return {
    broadcastTransaction(data: SignedTransaction) {
      broadcastMessage(peerSockets, { data, type: MessageType.transaction });
    },

    broadcastChain() {
      const { chain: data } = cfg;
      broadcastMessage(peerSockets, { data, type: MessageType.chain });
    },
  };
};

function broadcastMessage(peers: WebSocket[], msg: P2PMessage) {
  const serialized = JSON.stringify(msg);

  peers.forEach((ws: WebSocket) => {
    ws.send(serialized);
  });
}

function getMessageHandler(cfg: ServerConfig, newPeersCallback: NewPeersFunction): MessageHandler {
  return (msg: string) => {
    const p2pMessage: P2PMessage = JSON.parse(msg.toString());

    switch (p2pMessage.type) {
      case MessageType.chain: {
        return cfg.controllers.newChain(p2pMessage.data);
      }

      case MessageType.transaction: {
        return cfg.controllers.newTransaction(p2pMessage.data);
      }

      case MessageType.peers: {
        return newPeersCallback(p2pMessage.data);
      }

      default: {
        return;
      }
    }
  };
}

function sendChain(ws: WebSocket, chain: Blockchain) {
  ws.send(JSON.stringify({ data: chain, type: MessageType.chain }));
}
