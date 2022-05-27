'use strict';

const hexToBytes = (hex) => {
  const ret = new Uint8Array(hex.length / 2);
  for (let i = 0; i < ret.length; i++) {
    ret[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return ret;
};

const bytesToHex = (bytes) => {
  return Array.prototype.map
      .call(bytes, (x) => ('00' + x.toString(16)).slice(-2))
      .join('')
      .toUpperCase();
};

const hexToBuffer = (hex) => {
  return Buffer.from(hex, 'hex');
  return buffer;
};

const bufferToHex = (bytes) => {
  return bytes.toString('hex');
};

exports.hexToBytes = hexToBytes;
exports.bytesToHex = bytesToHex;
exports.hexToBuffer = hexToBuffer;
exports.bufferToHex = bufferToHex;
