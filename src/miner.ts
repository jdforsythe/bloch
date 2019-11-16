import { getLastBlockHash } from './chain/chain';

import { isValidTransaction, getCoinbaseTransaction } from './chain/transaction';
import { hashBlock } from './chain/block';
import { Blockchain, UnfinishedBlock, Block } from './chain/interface';

/**
 * Mine a new block asynchronously
 */
export async function mine(chain: Blockchain, difficulty: number, minerPubKey: string): Promise<Block> {
  const validTransactions = chain.mempool.filter(isValidTransaction);

  // don't mine an empty block
  if (!validTransactions.length) {
    return Promise.reject();
  }

  return new Promise((resolve, reject) => {
    // last block's hash when we started mining
    const lastHash = getLastBlockHash(chain);

    // the stuff that doesn't change between iterations
    const baseBlock: UnfinishedBlock = {
      lastHash,
      difficulty,
      nonce: undefined,
      timestamp: Date.now(),
      data: [
        getCoinbaseTransaction(minerPubKey),
        ...validTransactions,
      ],
    };

    function doWorkAsync(nonce: number): void {
      const block = getValidBlock({ ...baseBlock, nonce });

      if (block) {
        return resolve(block);
      }

      // check to see if the last block in the chain is different - in
      // which case mining this block is fruitless
      if (getLastBlockHash(chain) !== lastHash) {
        return reject();
      }

      // schedule next nonce - use Timer instead of Promises to avoid blocking
      // by filling the microtask queue or memory hogging
      setTimeout(() => doWorkAsync(nonce + 1), 0);
    }

    doWorkAsync(0);
  });
}

/**
 * Returns the valid block hash or `false` if nonce makes invalid hash
 */
function getValidBlock(block: UnfinishedBlock): Block | undefined {
  const { difficulty } = block;

  const hash = hashBlock(block);

  return hash.substring(0, difficulty) === '0'.repeat(difficulty) ? { ...block, hash } : undefined;
}
