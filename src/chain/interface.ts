/**
 * Blockchain state
 */
export interface Blockchain {
  blocks: Block[];
  mempool: SignedTransaction[];
  wallet: Wallet;
}

/**
 * Valid set of transactions for a block, starting with a Coinbase transaction
 * followed by any number of additional transactions
 */
export type BlockTransactionSet = [CoinbaseTransaction, ...SignedTransaction[]];

/**
 * A block that hasn't yet been mined (no permanent hash value)
 */
export interface UnfinishedBlock {
  timestamp: number;
  lastHash: string;
  data: BlockTransactionSet;
  nonce: number;
  difficulty: number;
}

/**
 * A block in the chain
 */
export interface Block extends UnfinishedBlock {
  hash: string;
}

/**
 * Unsigned Transaction input object
 */
export interface UnsignedTransactionInput {
  amount: number;
  address: string;
  timestamp: number;
}

/**
 * Signed Transaction input object
 */
export interface SignedTransactionInput extends UnsignedTransactionInput {
  signature: string;
}

/**
 * One of several outputs to a Transaction
 */
export interface TransactionOutput {
  amount: number;
  address: string;
}

/**
 * A Coinbase Transaction (block reward)
 */
export interface CoinbaseTransaction {
  id: string;
  input: {};
  outputs: TransactionOutput[];
}

interface Transaction<T> {
  id: string;
  input: T;
  outputs: TransactionOutput[];
}

/**
 * Unsigned Transaction object
 */
export type UnsignedTransaction = Transaction<UnsignedTransactionInput>;

/**
 * A cryptocurrency transaction
 */
export type SignedTransaction = Transaction<SignedTransactionInput>;

/**
 * Wallet for storing currency
 */
export interface Wallet {
  /**
   * Public Key (address) of wallet
   */
  address: string;

  /**
   * Last known balance of wallet
   */
  balance: number;
}
