import { getGenesisBlock, hashBlock } from './block';
import { getCurrentBalance } from './wallet';

import { Blockchain, Block, SignedTransaction } from './interface';

/**
 * Genesis of the blockchain
 */
export function getInitialBlockchain(address: string): Blockchain {
  const chain: Blockchain = {
    blocks: [getGenesisBlock()],
    mempool: [],
    wallet: {
      address,
      balance: 0,
    },
  };

  chain.wallet.balance = getCurrentBalance(chain.wallet.address, chain.blocks);

  return chain;
}

/**
 * Utility to get the last block in a chain
 */
export function getLastBlockHash(chain: Blockchain): string {
  return chain.blocks[chain.blocks.length - 1].hash;
}

/**
 * Given a new potential chain, return the new blockchain state
 * by replacing our chain if the new one is valid and longer
 * or keeping our existing chain if the new one is invalid
 */
export function getBestChain(chain: Blockchain, newChain: Blockchain): Blockchain {
  // if chain is not longer than ours or it's invalid, keep our chain
  if (newChain.blocks.length <= chain.blocks.length || !isValidChain(newChain.blocks)) {
    return chain;
  }

  return newChain;
}

/**
 * When a new block is mined, get the new blockchain state to send to peers
 * and continue working from
 */
export function getChainWithNewBlock(chain: Blockchain, block: Block): Blockchain {
  // filter transactions from the new block out of the mempool
  const transactionIds = block.data.map((tx: SignedTransaction) => tx.id);

  const blocks = [...chain.blocks, block];
  const mempool = chain.mempool.filter((tx: SignedTransaction) => {
    return !transactionIds.includes(tx.id);
  });

  return { ...chain, blocks, mempool };
}

/**
 * Determine if the provided chain is valid
 */
function isValidChain(newChain: Block[]): boolean {
  // verify first block is genesis block
  if (JSON.stringify(newChain[0]) !== JSON.stringify(getGenesisBlock())) {
    return false;
  }

  for (let i = 1; i < newChain.length; i += 1) {
    const current: Block = newChain[i];
    const last: Block = newChain[i - 1];

    // verify provenance of each block
    if (current.lastHash !== last.hash) {
      return false;
    }

    // verify current hash
    if (current.hash !== hashBlock(current)) {
      return false;
    }
  }

  return true;
}
