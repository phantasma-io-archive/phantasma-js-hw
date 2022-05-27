'use strict';

// libraries
const chai = require('chai');
const bip39 = require('bip39');
const bip32Factory = require('bip32').default;
const curve = require('tiny-secp256k1');

// modules
const expect = chai.expect;
const mnemonicUtil = require('../../scripts/mnemonic.js');

const config = {
  bip39: bip39,
  bip32Factory: bip32Factory,
  curve: curve,
};

// functions
describe('mnemonic', () => {
  it('mnemonic', () => {
    const mnemonic = 'bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon';
    const expectedPrivateKey = '06A5C79F5CFA6C7F614DD20FF982962841F5C72DD89275F955B0CAAF9878747C';
    const actualPrivateKey = mnemonicUtil.getPrivateKeyFromMnemonic(config, mnemonic, 0);
    expect(actualPrivateKey).to.equal(expectedPrivateKey);
  });
  it('poltergeist mnemonic', () => {
    const mnemonic = 'bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon';
    const expectedPoltergeistMnemonic = 'allow comfort treat rigid plug distance lunch ripple avocado slot pitch explain butter toe resist banner invest skirt history next wet destroy spin long';
    const actualPoltergeistMnemonic = mnemonicUtil.getPoltergeistMnemonic(config, mnemonic, 0);
    expect(actualPoltergeistMnemonic).to.equal(expectedPoltergeistMnemonic);
  });

  beforeEach(async () => {});

  afterEach(async () => {});
});
