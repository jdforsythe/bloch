import { ec } from 'elliptic';
import { SHA256 as sha256 } from 'crypto-js';
import { v1 as uuidV1 } from 'uuid';

// https://en.bitcoin.it/wiki/Secp256k1
const ellipticCurve = new ec('secp256k1');

/**
 * Get a hash from a string
 */
export function generateHash(data: string) {
  return sha256(data).toString();
}

/**
 * Get a unique ID
 */
export function generateUUID(): string {
  return uuidV1();
}

/**
 * Sign a hash with the private key
 */
export function signHash(privKey: string, hash: string) {
  const keypair = ellipticCurve.keyFromPrivate(privKey, 'hex');

  return keypair.sign(hash).toDER('hex');
}

/**
 * Verify signature against expected hash
 */
export function verifySignature(pubKey: string, signature: string, expectedHash: string): boolean {
  try {
    return ellipticCurve.keyFromPublic(pubKey, 'hex').verify(expectedHash, signature);
  }
  catch (ex) {
    return false;
  }
}
