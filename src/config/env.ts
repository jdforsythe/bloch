import * as assert from 'assert';

const env: NodeJS.ProcessEnv = process.env;

const REQUIRED_ENV_VARS: string[] = [
  'P2P_PORT',
  'MAX_PEERS',
  'MINER_PUB_KEY',
  'MINER_PRIV_KEY',
  'HTTP_HOST',
  'HTTP_PORT',
];

/**
 * Configuration loaded from the environment
 */
export interface EnvironmentConfiguration {
  /**
   * Port to listen on for p2p server
   */
  p2pPort: number;

  /**
   * List of well known peers in format 'host:port'
   */
  knownPeers: string[];

  /**
   * Maximum number of peer connections to open
   */
  maxPeers: number;

  /**
   * Host to listen on for HTTP API
   */
  httpHost: string;

  /**
   * Port to listen on for HTTP API
   */
  httpPort: number;

  /**
   * Public key address to miner's wallet
   */
  minerPubKey: string;

  /**
   * Private key to sign from miner's wallet
   */
  minerPrivKey: string;
}

/**
 * Configuration singleton
 */
export const environment: EnvironmentConfiguration = ((): EnvironmentConfiguration => {
  REQUIRED_ENV_VARS.forEach((v) => assert(env[v], new Error(`[FATAL] Missing environment variable ${v}`)));

  return {
    p2pPort: +env.P2P_PORT,
    knownPeers: env.KNOWN_PEERS ? env.KNOWN_PEERS.split(',') : [],
    maxPeers: +env.MAX_PEERS,
    httpHost: env.HTTP_HOST,
    httpPort: +env.HTTP_PORT,
    minerPubKey: env.MINER_PUB_KEY,
    minerPrivKey: env.MINER_PRIV_KEY,
  };
})();
