'use strict';

// libraries
const crypto = require('crypto');
const chai = require('chai');
const {phantasmaJS} = require('phantasma-ts');
const wif = require('wif');

// modules
const expect = chai.expect;
const addressTranscodeUtil = require('../../scripts/address-transcode.js');

// functions
describe('address transcode', () => {
  it('test address transcode', () => {
    const privateKey = crypto.randomBytes(32).toString('hex').toUpperCase();
    const walletWif = wif.encode(128, Buffer.from(privateKey, 'hex'), true);
    const expectedAddress = phantasmaJS.getAddressFromWif(walletWif);
    const actualAddress = addressTranscodeUtil.getAddressFromPrivateKey(privateKey);
    expect(actualAddress).to.equal(expectedAddress);
  });

  beforeEach(async () => {});

  afterEach(async () => {});
});
