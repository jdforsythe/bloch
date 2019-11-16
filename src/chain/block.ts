import { generateHash } from '../crypto';
import { UnfinishedBlock, Block } from './interface';

/**
 * Get the special "Genesis" block
 */
export function getGenesisBlock(): Block   {
  return {
    timestamp: 380221200000,
    lastHash: 'bigbang',
    hash: '0000c5f48c60d075730f45945cc7f8cad953e7d0f168186c8c7d3ff07db6f0f7',
    data: [{
      id: 'genesis',
      input: {},
      outputs: [
        {
          address: '046acf12468cb92de2e7bf7442987d73c183719454ccd91e42c5785437954c97418ec6fa979c63e82f4dd794db28f86f41ac81275603dbad9f99ac06d5046c133a',
          amount: 1000,
        },
      ],
    }],
    nonce: 195250,
    difficulty: 4,
  };
}

/**
 * Get the hash for a block
 */
export function hashBlock(block: UnfinishedBlock): string {
  const { timestamp, lastHash, data, nonce, difficulty } = block;

  return generateHash(`${timestamp}${lastHash}${JSON.stringify(data)}${nonce}${difficulty}`);
}
