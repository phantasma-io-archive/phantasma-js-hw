'use strict';

const bs58 = require('bs58');

const transactionSignUtil = require('./transaction-sign.js');

/*
 * based on address transcoding here:
 *
 * https://github.com/phantasma-io/phantasma-ts/blob/7d04aaed839851ae5640f68ab223ca7d92c42016/core/tx/utils.js
 */

const getAddressFromPrivateKey = (privateKey) => {
  const publicKey = transactionSignUtil.getPublicFromPrivate(privateKey);
  return getAddressFromPublicKey(publicKey);
};

const getAddressFromPublicKey = (publicKey) => {
  const addressHex = Buffer.from('0100' + publicKey, 'hex');
  return 'P' + bs58.encode(addressHex);
};

exports.getAddressFromPrivateKey = getAddressFromPrivateKey;
exports.getAddressFromPublicKey = getAddressFromPublicKey;
