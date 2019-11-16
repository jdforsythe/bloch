import { Blockchain, SignedTransaction } from '../chain/interface';
/**
 * Type of message being sent
 */
export const enum MessageType {
  chain = 'chain',
  transaction = 'transaction',
  peers = 'peers',
}

/**
 * P2P message sending a new chain
 */
export interface NewChainMessage {
  type: MessageType.chain;
  data: Blockchain;
}

/**
 * P2P message sending a new transaction
 */
export interface NewTransactionMessage {
  type: MessageType.transaction;
  data: SignedTransaction;
}

/**
 * P2P message sending a peer list
 */
export interface PeersMessage {
  type: MessageType.peers;
  data: string[];
}

/**
 * Message sent over P2P connection
 */
export type P2PMessage = |
  NewChainMessage |
  NewTransactionMessage |
  PeersMessage;
