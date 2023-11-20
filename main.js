'use strict';

const index = require('./index.js');

const bip39 = require('bip39');

const curve = require('tiny-secp256k1');

const {phantasmaJS, PhantasmaAPI, ScriptBuilder} = require('phantasma-ts');

const bip32Factory = require('bip32').default;

// const phantasmaRPC = new phantasmaJS.PhantasmaAPI('https://seed.ghostdevs.com:7077/rpc', 'https://explorer.phantasma.io/mainnet-getpeers.json', 'mainnet');

const phantasmaRPC = new PhantasmaAPI('https://testnet.phantasma.io/rpc', undefined, 'testnet');

const transportNodeHid = require('@ledgerhq/hw-transport-node-hid');

const config = {};
config.blockchainExplorer = 'https://explorer.phantasma.io/nexus';
config.debug = true;
config.transport = transportNodeHid.default;
config.http = require('http');
config.rpc = phantasmaRPC;
config.bip32Factory = bip32Factory;
config.bip39 = bip39;
config.curve = curve;
config.scriptBuilder = new ScriptBuilder();
config.nexusName = 'testnet';
config.chainName = 'main';
// config.nexusName = 'test';
// config.chainName = 'main';
config.tokenNames = ['KCAL', 'SOUL'];
config.gasPrice = 100000;
config.gasLimit = 900;
config.verifyResponse = true;

const commands = {};
commands['linfo'] = async () => {
  const response = await index.getLedgerDeviceInfo(config);
  console.log('info', response);
};
commands['getpoltergeistmnemonic'] = async (mnemonic) => {
  const response = await index.getPoltergeistMnemonic(config, mnemonic);
  if (config.debug) {
    console.log('getPoltergeistMnemonic response', response);
  }

  if (response.success) {
    console.log('poltergeist mnemonic', response.poltergeistMnemonic);
  } else {
    console.log('poltergeist mnemonic error', response.message);
  }
};
commands['getmbalance'] = async (mnemonic) => {
  const response = await index.getBalanceFromMnemonic(config, mnemonic, 0);
  if (config.debug) {
    console.log('getBalanceFromMnemonic response', response);
  }

  if (response.success) {
    console.log('address', response.address);
    console.log('balances', response.balances);
  } else {
    console.log('balance error', response.message);
  }
};

commands['getladdress'] = async (mnemonic) => {
  const response = await index.getBalanceFromLedger(config, {verifyOnDevice: true});
  if (config.debug) {
    console.log('getAddressFromLedger response', response);
  }
  if (response.success) {
    console.log('address', response.address);
  } else {
    console.log('address error', response.message);
  }
};

commands['getlpublic'] = async (mnemonic) => {
  const response = await index.getAddressFromLedeger(config, {verifyOnDevice: true});
  if (config.debug) {
    console.log('getAddressFromLedger response', response);
  }
  if (response.success) {
    console.log('address', response);
  } else {
    console.log('address error', response);
  }
};

commands['getlbanpm start getladdresslance'] = async (mnemonic) => {
  const response = await index.getBalanceFromLedger(config, {verifyOnDevice: false});
  if (config.debug) {
    console.log('getBalanceFromLedger response', response);
  }
  if (response.success) {
    console.log('address', response.address);
    console.log('balances', response.balances);
  } else {
    console.log('balance error', response.message);
  }
};

commands['msend'] = async (amount, tokenName, toAddress, mnemonic, debug) => {
  if (debug !== undefined) {
    config.debug = (debug == 'true');
  }
  const response = await index.sendAmountUsingMnemonic(config, amount, tokenName, toAddress, mnemonic, 0);
  if (config.debug) {
    console.log('sendAmountUsingMnemonic response', JSON.stringify(response));
  }
  if (response.success) {
    console.log('send success', response.message);
  } else {
    console.log('send error', response.message);
  }
};

commands['lsend'] = async (amount, tokenName, toAddress) => {
  console.log('sendAmountUsingLedger', amount, toAddress);
  const response = await index.sendAmountUsingLedger(config, amount, tokenName, toAddress);
  if (config.debug) {
    console.log('sendAmountUsingLedger', 'response', response);
  }
  if (response.success) {
    console.log('send success');
  } else {
    console.log('send error', response.message);
  }
};

const run = async () => {
  console.log('phantasma-js-hw');
  if (process.argv.length < 3) {
    console.log('#usage:');
    console.log('https://github.com/coranos/phantasma-js-hw/blob/master/docs/cli.md');
  } else {
    const command = process.argv[2];
    const arg0 = process.argv[3];
    const arg1 = process.argv[4];
    const arg2 = process.argv[5];
    const arg3 = process.argv[6];

    const fn = commands[command];
    if (fn == undefined) {
      console.log('unknown command', command);
    } else {
      await fn(arg0, arg1, arg2, arg3);
    }
  }
};

run();
