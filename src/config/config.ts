/**
 * Static, hard-coded configuration
 */
export interface StaticConfiguration {
  /**
   * Number of zeroes to appear at the start of valid block hashes
   */
  difficulty: number;

  /**
   * Reward for mining a block
   */
  miningReward: number;
}

/**
 * Configuration
 */
export const config: StaticConfiguration = {
  difficulty: 4,
  miningReward: 10,
};
