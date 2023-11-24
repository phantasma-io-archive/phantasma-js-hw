'use strict';

const bs58 = require('bs58');

/*
 * based on address transcoding here:
 *
 * https://github.com/phantasma-io/phantasma-ts/blob/7d04aaed839851ae5640f68ab223ca7d92c42016/core/tx/utils.js
 */
const { phantasmaJS, ScriptBuilder, Address, Transaction, PhantasmaKeys, Base16 } = require('phantasma-ts');

const getAddressFromPrivateKey = (privateKey) => {
  const keys = PhantasmaKeys.fromWIF(privateKey);
  const publicKey = keys.Address.Text;
  return publicKey;
};

const getAddressFromPublicKey = (publicKey) => {
  // Assuming Base16.decodeUint8Array is a function that decodes a base16 string to Uint8Array
  let pubKeyBytes = Base16.decodeUint8Array(publicKey);
  // Create a new array and set the first two elements
  let addrArray = new Uint8Array(34);
  addrArray[0] = 1;
  // Copy 32 bytes from the 2nd position of pubKeyBytes to addrArray, starting from the 3rd position of addrArray
  addrArray.set(pubKeyBytes.slice(0, 32), 2);
  return 'P' + bs58.encode(addrArray);
};

exports.getAddressFromPrivateKey = getAddressFromPrivateKey;
exports.getAddressFromPublicKey = getAddressFromPublicKey;
