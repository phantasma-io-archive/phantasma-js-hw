'use strict';

// libraries
const chai = require('chai');
const bip39 = require('bip39');
const bip32Factory = require('bip32').default;

const curve = require('tiny-secp256k1');

const {phantasmaJS} = require('phantasma-ts');

const phantasmaRPC = new phantasmaJS.PhantasmaAPI('http://testnet.phantasma.io/rpc', 'https://peers.phantasma.io/testnet-getpeers.json', 'testnet');

// modules
const expect = chai.expect;
const index = require('../../index.js');

// functions
describe('index', () => {
  it('getBalanceFromMnemonic', async () => {
    const config = {
      bip39: bip39,
      bip32Factory: bip32Factory,
      rpc: phantasmaRPC,
      curve: curve,
    };
    const mnemonic = 'bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon bacon';
    const actualResponse = await index.getBalanceFromMnemonic(config, mnemonic, 0);
    const expectedResponse = {
      'address': 'P2K8PYMSwiSuUj4fU1mVRin1BYJsdWcfTFTvsJJ3m8MiDgk',
      'balances': {},
      'success': true,
    };
    expect(actualResponse).to.deep.equal(expectedResponse);
  });

  beforeEach(async () => {});

  afterEach(async () => {});
});
