#!/usr/bin/env node

const { ec } = require('elliptic');

const ellipticCurve = new ec('secp256k1');

function generateKeyPair() {
  const keyPair = ellipticCurve.genKeyPair();

  const pub = keyPair.getPublic('hex');
  const priv = keyPair.getPrivate('hex');

  return { pub, priv };
}

console.log(generateKeyPair());
