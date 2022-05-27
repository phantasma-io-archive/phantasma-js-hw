'use strict';

const hexToBytesTranscoder = require('./hex-to-bytes-transcoder.js');

// coin used by ledger nano s.
// 627   | 0x80000273 | SOUL   | [Phantasma](https://phantasma.io/)
const SOUL_COIN = 627;

/**
 * converts a mnemonic into a private key, using the phantasma coin's bip44 path.
 *
 * @memberof Mnemonic
 * @param {string} config the config
 * @param {string} mnemonic the mnemonic
 * @param {string} index the bip44 index
 * @return {string} returns the private key, hex encoded, upper case.
 */
const getPrivateKeyFromMnemonic = (config, mnemonic, index) => {
  const bip39 = config.bip39;
  const seedBytes = bip39.mnemonicToSeedSync(mnemonic);
  // console.log('getPrivateKeyFromMnemonic', 'seedBytes', seedBytes);
  const seed = hexToBytesTranscoder.bufferToHex(seedBytes);
  return getPrivateKeyFromSeed(config, seed, index);
};

/**
 * converts a mnemonic into a seed.
 *
 * @memberof Mnemonic
 * @param {string} config the config
 * @param {string} seed the seed
 * @param {string} index the bip44 index
 * @return {string} returns the seed, hex encoded, upper case.
 */
const getPrivateKeyFromSeed = (config, seed, index) => {
  const bip32Factory = config.bip32Factory;
  const curve = config.curve;
  const seedBytes = hexToBytesTranscoder.hexToBuffer(seed);
  // console.log('getPrivateKeyFromSeed', 'seedBytes', seedBytes);
  // const bip39seed = Buffer.from(seedBytes).toString('hex');
  // console.log('bip39seed', bip39seed);
  const bip32 = bip32Factory(curve);
  const bip32node = bip32.fromSeed(seedBytes);
  // console.log('bip32node', bip32node);

  const bip44path = getBip44Path(index);
  const bip32child = bip32node.derivePath(bip44path);
  // console.log('bip32child', bip32child);

  return Buffer.from(bip32child.privateKey).toString('hex').toUpperCase();
};

/**
 * converts a mnemonic into a Poltergeist mnemonic, using the phantasma coin's bip44 path. The Poltergeist mnemonic is the mnemonic for the private key
 *
 * @memberof Mnemonic
 * @param {string} config the config
 * @param {string} mnemonic the mnemonic
 * @param {string} index the index
 * @return {string} returns the private key, hex encoded, upper case.
 */
const getPoltergeistMnemonic = (config, mnemonic, index) => {
  const bip39 = config.bip39;
  const privateKey = getPrivateKeyFromMnemonic(config, mnemonic, index);
  const poltergeistMnemonic = bip39.entropyToMnemonic(privateKey);
  return poltergeistMnemonic;
};

/**
 * @memberof Mnemonic
 * @param {string} index the index
 * @return {string} returns the bip44 path.
 */
const getBip44Path = (index) => {
  const bip44path = `m/44'/${SOUL_COIN}'/0'/0/${index}`;
  return bip44path;
};

exports.getPrivateKeyFromMnemonic = getPrivateKeyFromMnemonic;
exports.getPrivateKeyFromSeed = getPrivateKeyFromSeed;
exports.getPoltergeistMnemonic = getPoltergeistMnemonic;
exports.getBip44Path = getBip44Path;
