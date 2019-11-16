import { verifySignature, generateHash, generateUUID, signHash } from '../crypto';
import { config } from '../config/config';
import { CoinbaseTransaction, UnsignedTransaction, SignedTransaction } from './interface';

/**
 * Get special reward transaction
 */
export function getCoinbaseTransaction(minerAddress: string): CoinbaseTransaction {
  return {
    id: generateUUID(),
    input: {},
    outputs: [
      { address: minerAddress, amount: config.miningReward },
    ],
  };
}

/**
 * Get a new transaction
 */
export function getNewTransaction(sourceAddress: string, destAddress: string, sourceBalance: number, sendAmount: number): UnsignedTransaction {
  if (sendAmount > sourceBalance) {
    throw new RangeError(`Amount ${sendAmount} exceeds wallet balance of ${sourceBalance}`);
  }

  return {
    id: generateUUID(),
    input: {
      address: sourceAddress,
      amount: sourceBalance,
      timestamp: Date.now(),
    },
    outputs: [
      { address: destAddress, amount: sendAmount },
      { address: sourceAddress, amount: sourceBalance - sendAmount },
    ],
  };
}

/**
 * Cryptographically sign a transaction with sender's private key
 */
export function signTransaction(unsigned: UnsignedTransaction, senderPrivKey: string): SignedTransaction {
  const hashedOutputs = generateHash(JSON.stringify(unsigned.outputs));
  const signature = signHash(senderPrivKey, hashedOutputs);

  return {
    ...unsigned,
    input: {
      ...unsigned.input,
      signature,
    },
  };
}

/**
 * Determine if a transaction is valid
 */
export function isValidTransaction(tx: SignedTransaction): boolean {
  const startingBalance: number = tx.input.amount;
  const outputBalance: number = tx.outputs.reduce((acc, out) => acc + out.amount, 0);

 // sum of all outputs must match input
  if (outputBalance !== startingBalance) {
    return false;
  }

  const { address, signature } = tx.input;

  const expectedTxHash = generateHash(JSON.stringify(tx.outputs));

  return verifySignature(address, signature, expectedTxHash);
}
