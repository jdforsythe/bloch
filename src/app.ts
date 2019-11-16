import { environment } from './config/env';
import { config } from './config/config';

import { Blockchain, Block, SignedTransaction, UnsignedTransaction } from './chain/interface';
import { getInitialBlockchain, getBestChain, getChainWithNewBlock } from './chain/chain';
import { getCurrentBalance } from './chain/wallet';
import { getNewTransaction, signTransaction } from './chain/transaction';
import { mine } from './miner';

import {
  ServerConfig as P2PServerConfig,
  listen as p2pListen,
  ServerBroadcastMethods,
} from './p2p-server/server';

import {
  ServerConfig as HTTPServerConfig,
  listen as httpListen,
} from './http-api/server';

function doWork(chain: Blockchain, broadcast: ServerBroadcastMethods) {
  if (!chain.mempool.length) {
    console.log('No transactions. Delaying...');

    setTimeout(() => doWork(chain, broadcast), 2000);

    return;
  }

  const { difficulty } = config;
  const { minerPubKey } = environment;

  console.log('Mining block...');
  mine(chain, difficulty, minerPubKey)
    .then((block: Block) => {
      console.log('Found a block!');

      // we have a new block! update our chain and broadcast it to everyone!
      const { blocks, mempool } = getChainWithNewBlock(chain, block);

      chain.blocks = blocks;
      chain.mempool = mempool;

      // get our new balance (with any withdrawals and our block reward)
      chain.wallet.balance = getCurrentBalance(chain.wallet.address, chain.blocks);

      broadcast.broadcastChain();

      setTimeout(() => doWork(chain, broadcast), 0);
    })
    .catch(() => {
      console.log('The pool changed');

      // this happens if the chain changes while we're mining this block
      setTimeout(() => doWork(chain, broadcast), 0);
    });
}

/**
 * Run the application
 */
export const app = (): void => {
  console.log('Initializing blockchain');

  const chain: Blockchain = getInitialBlockchain(environment.minerPubKey);

  // initialize peer server - answer others
  const p2pServerConfig: P2PServerConfig = {
    chain,
    port: environment.p2pPort,
    knownPeers: environment.knownPeers,
    maxPeers: environment.maxPeers,
    controllers: {
      newChain: (newChain: Blockchain) => {
        const { blocks, mempool } = getBestChain(chain, newChain);

        chain.blocks = blocks;
        chain.mempool = mempool;

        chain.wallet.balance = getCurrentBalance(chain.wallet.address, chain.blocks);
      },
      newTransaction: (transaction: SignedTransaction) => {
        // don't accept a transasction unless the sending user has some coins
        const currentBalance = getCurrentBalance(transaction.input.address, chain.blocks);

        if (currentBalance < transaction.input.amount) {
          console.error('Possible attempted overspend. Ignoring transaction');

          return;
        }

        chain.mempool = [...chain.mempool, transaction];
      },
    },
  };

  console.log('Setting up p2p server');
  const broadcast: ServerBroadcastMethods = p2pListen(p2pServerConfig);

  console.log('Setting up HTTP API');
  const httpServerConfig: HTTPServerConfig = {
    chain,
    port: environment.httpPort,
    host: environment.httpHost,
    controllers: {
      getBalance: () => {
        chain.wallet.balance = getCurrentBalance(chain.wallet.address, chain.blocks);

        return chain.wallet.balance;
      },
      getBlocks: (): Block[] => {
        return chain.blocks;
      },
      getMempool: (): SignedTransaction[] => {
        return chain.mempool;
      },
      getPublicKey: (): string => {
        return environment.minerPubKey;
      },
      sendTransaction: (destAddress: string, amount: number): void => {
        const { address, balance } = chain.wallet;

        // don't allow two spends in the mempool from the same address
        if (chain.mempool.find((t) => t.input.address === address)) {
          throw new Error('Please wait until your last transaction is verified');
        }
        console.log(`Sending ${amount} coins to ${destAddress}`);

        const transaction: UnsignedTransaction = getNewTransaction(address, destAddress, balance, amount);
        const signed: SignedTransaction = signTransaction(transaction, environment.minerPrivKey);

        console.log('Adding signed transaction to the mempool and broadcasting');

        chain.mempool = [...chain.mempool, signed];

        broadcast.broadcastTransaction(signed);
      },
    },
  };

  httpListen(httpServerConfig, () => console.log(`Listening on http://${environment.httpHost}:${environment.httpPort}`));

  console.log('Starting mining loop');
  doWork(chain, broadcast);
};
