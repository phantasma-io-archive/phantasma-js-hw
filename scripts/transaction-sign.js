'use strict';
// libraries
const crypto = require('crypto');

// modules

// constants
const PUBLIC_KEY_PREFIX = '302A300506032B6570032100';

const DEBUG = false;

// variables

// functions
// const getSHA256Hash = (buffer) => {
//   return crypto.createHash('sha256').update(buffer).digest();
// };

const privateToDer = (privateKeyHex) => {
  // ed25519 curve
  // return keyEncoder.encodePrivate(privateKeyHex, 'raw', 'der');
  // const publicKey = getPublicFromPrivate(privateKeyHex);
//  const derHex = `30740201010420${privateKeyHex}a00706052b8104000aa144034200${publicKey}`;
/* istanbul ignore if */
  if (DEBUG) {
    console.log('privateToDer', 'privateKeyHex', privateKeyHex);
  }
  const derHex = `302e020100300506032b657004220420${privateKeyHex}`;
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('privateToDer', 'derHex', derHex);
  }
  return Buffer.from(derHex, 'hex');
};

const publicToDer = (publicKeyHex) => {
  const publicKeyDerHex = `${PUBLIC_KEY_PREFIX}${publicKeyHex}`;
  return Buffer.from(publicKeyDerHex, 'hex');
};

const publicToPem = (publicKeyHex) => {
  const publicKeyDer = publicToDer(publicKeyHex);
  const publicKeyDerBase64 = publicKeyDer.toString('base64');
  const publicKeyHexPem = `-----BEGIN PUBLIC KEY-----\n${publicKeyDerBase64}\n-----END PUBLIC KEY-----`;
  // return Buffer.from(, 'hex');
  return publicKeyHexPem;
  // return keyEncoder.encodePublic(publicKeyHex, 'raw', 'pem');
};

const signBytes = (hash, privateKey) => {
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('signBytes.hash', hash);
  }
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('signBytes.privateKey', privateKey);
  }
  const privateKeyDer = privateToDer(privateKey.toString('hex'));
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('signBytes.privateKeyDer', privateKeyDer);
  }
  const privateKeyObj = crypto.createPrivateKey( {key: Buffer.from(privateKeyDer, 'hex'), format: 'der', type: 'pkcs8'} );
  const signature = crypto.sign(undefined, hash, privateKeyObj);
  const signatureHex = signature.toString('hex');
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('signatureHex', signatureHex);
  }

  return signatureHex;
};

const getHash = (encodedTx, debug) => {
  // NOTE: code does not actually hash the tx, it just uses it raw, unhashed.
  return Buffer.from(encodedTx, 'hex');
  // /* istanbul ignore if */
  // if (DEBUG || (debug == true)) {
  //   console.log('getHash', 'encodedTx', encodedTx);
  // }
  // const hash = getSHA256Hash(Buffer.from(encodedTx, 'hex'));
  // /* istanbul ignore if */
  // if (DEBUG || (debug == true)) {
  //   console.log('getHash', 'hash', hash.toString('hex'));
  // }
  // return hash.toString('hex');
};

const sign = (encodedTx, privateKeyHex) => {
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('sign', 'encodedTx', encodedTx);
  }
  const privateKey = Buffer.from(privateKeyHex, 'hex');
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('sign', 'privateKey', privateKey.toString('hex'));
  }
  const hash = getHash(encodedTx);
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('sign', 'hash', hash.toString('hex'));
  }
  // const bytes = Buffer.from(encodedTx, 'hex');
  const signature = signBytes(hash, privateKey);
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('sign', 'signature', signature.toString('hex'));
  }
  return signature.toLowerCase();
};

const verify = (encodedTx, signatureHex, publicKeyHex) => {
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('verify', 'encodedTx', encodedTx);
    console.log('verify', 'signatureHex', signatureHex);
    console.log('verify', 'publicKeyHex', publicKeyHex);
  }
  const publicKeyPem = publicToPem(publicKeyHex);
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('verify', 'publicKeyPem', publicKeyPem);
  }
  const publicKeyObj = crypto.createPublicKey( {key: publicKeyPem, format: 'pem', type: 'spki'} );
  const signature = Buffer.from(signatureHex, 'hex');
  const hash = getHash(encodedTx);
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('verify', 'hash', hash.toString('hex'));
  }
  return crypto.verify(undefined, hash, publicKeyObj, signature);
};

const getPublicFromPrivate = (privateKey) => {
  const privateKeyDer = privateToDer(privateKey.toString('hex'));
  const privateKeyObj = crypto.createPrivateKey( {key: Buffer.from(privateKeyDer, 'hex'), format: 'der', type: 'pkcs8'} );
  const publicKeyObj = crypto.createPublicKey( {key: privateKeyObj, format: 'pem', type: 'sec1'} );
  const encodedHex = publicKeyObj.export({format: 'der', type: 'spki'}).toString('hex').toUpperCase();
  if (encodedHex.startsWith(PUBLIC_KEY_PREFIX)) {
    return encodedHex.substring(PUBLIC_KEY_PREFIX.length);
  } else {
    throw Error(`unknown prefix, expecting '${PUBLIC_KEY_PREFIX}' cannot decode public key '${encodedHex}'`);
  }
};

exports.sign = sign;
exports.getHash = getHash;
exports.verify = verify;
exports.getPublicFromPrivate = getPublicFromPrivate;
