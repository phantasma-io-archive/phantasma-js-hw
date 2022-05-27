'use strict';

// libraries
const crypto = require('crypto');
const chai = require('chai');
const {phantasmaJS} = require('phantasma-ts');
const elliptic = require('elliptic');
/* eslint-disable */
const curve = new elliptic.eddsa('ed25519');
/* eslint-enable */
// const wif = require('wif');

// modules
const expect = chai.expect;
const addressTranscodeUtil = require('../../scripts/address-transcode.js');
const transactionSignUtil = require('../../scripts/transaction-sign.js');
const transactionTranscodeUtil = require('../../scripts/transaction-transcode.js');

// functions
describe('transaction transcode', () => {
  it('test unsigned transaction transcode KCAL', () => {
    const expirationDate = transactionTranscodeUtil.getExpirationDate();
    const expirationDateUTCseconds = transactionTranscodeUtil.getDateAsUTCSeconds(expirationDate);
    const nexusName = 'mainnet';
    const chainName = 'main';
    const tokenName = 'KCAL';
    const gasPrice = parseInt(crypto.randomBytes(4).toString('hex'), 16);
    const gasLimit = parseInt(crypto.randomBytes(4).toString('hex'), 16);
    const amount = parseInt(crypto.randomBytes(4).toString('hex'), 16);
    const payload = crypto.randomBytes(32).toString('hex').toUpperCase();
    const fromPrivateKey = crypto.randomBytes(32).toString('hex').toUpperCase();
    const toPrivateKey = crypto.randomBytes(32).toString('hex').toUpperCase();
    const fromAddress = addressTranscodeUtil.getAddressFromPrivateKey(fromPrivateKey);
    const toAddress = addressTranscodeUtil.getAddressFromPrivateKey(toPrivateKey);
    const txObject = transactionTranscodeUtil.getSendTxObject(fromAddress, toAddress, amount, tokenName, payload, gasPrice, gasLimit, expirationDate, nexusName, chainName);
    const tx = transactionTranscodeUtil.encodeSendTxWithSignature(txObject);
    // console.log('tx.length', tx.length);
    const expectedTx = {
      nexusName: nexusName,
      chainName: chainName,
      from: fromAddress,
      to: toAddress,
      amount: amount,
      tokenName: tokenName,
      payload: payload,
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      expirationDate: expirationDateUTCseconds,
    };
    const actualTx = transactionTranscodeUtil.decodeSendTxWithoutSignature(tx);
    delete actualTx.opcodeOffsets;
    delete actualTx.script;

    // delete expectedTx.opcodeOffsets;
    const expectedTxStr = JSON.stringify(expectedTx);
    const actualTxStr = JSON.stringify(actualTx);
    // console.log('expectedTxStr', expectedTxStr);
    // console.log('actualTxStr  ', actualTxStr);
    expect(actualTxStr).to.equal(expectedTxStr);
  });
  it('test unsigned transaction transcode SOUL', () => {
    const expirationDate = transactionTranscodeUtil.getExpirationDate();
    const expirationDateUTCseconds = transactionTranscodeUtil.getDateAsUTCSeconds(expirationDate);
    const nexusName = 'mainnet';
    const chainName = 'main';
    const tokenName = 'SOUL';
    const gasPrice = parseInt(crypto.randomBytes(4).toString('hex'), 16);
    const gasLimit = parseInt(crypto.randomBytes(4).toString('hex'), 16);
    const amount = parseInt(crypto.randomBytes(4).toString('hex'), 16);
    const payload = crypto.randomBytes(32).toString('hex').toUpperCase();
    const fromPrivateKey = crypto.randomBytes(32).toString('hex').toUpperCase();
    const toPrivateKey = crypto.randomBytes(32).toString('hex').toUpperCase();
    const fromAddress = addressTranscodeUtil.getAddressFromPrivateKey(fromPrivateKey);
    const toAddress = addressTranscodeUtil.getAddressFromPrivateKey(toPrivateKey);
    const txObject = transactionTranscodeUtil.getSendTxObject(fromAddress, toAddress, amount, tokenName, payload, gasPrice, gasLimit, expirationDate, nexusName, chainName);
    const tx = transactionTranscodeUtil.encodeSendTxWithSignature(txObject);
    // console.log('tx.length', tx.length);
    const expectedTx = {
      nexusName: nexusName,
      chainName: chainName,
      from: fromAddress,
      to: toAddress,
      amount: amount,
      tokenName: tokenName,
      payload: payload,
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      expirationDate: expirationDateUTCseconds,
    };
    const actualTx = transactionTranscodeUtil.decodeSendTxWithoutSignature(tx);
    delete actualTx.opcodeOffsets;
    delete actualTx.script;

    const expectedTxStr = JSON.stringify(expectedTx);
    const actualTxStr = JSON.stringify(actualTx);
    // console.log('expectedTxStr', expectedTxStr);
    // console.log('actualTxStr  ', actualTxStr);
    expect(actualTxStr).to.equal(expectedTxStr);
  });
  it('test unsigned transaction transcode ERROR', () => {
    const expirationDate = transactionTranscodeUtil.getExpirationDate();
    const expirationDateUTCseconds = transactionTranscodeUtil.getDateAsUTCSeconds(expirationDate);
    const nexusName = 'mainnet';
    const chainName = 'main';
    const tokenName = 'ERROR';
    const gasPrice = parseInt(crypto.randomBytes(4).toString('hex'), 16);
    const gasLimit = parseInt(crypto.randomBytes(4).toString('hex'), 16);
    const amount = parseInt(crypto.randomBytes(4).toString('hex'), 16);
    const payload = crypto.randomBytes(32).toString('hex').toUpperCase();
    const fromPrivateKey = crypto.randomBytes(32).toString('hex').toUpperCase();
    const toPrivateKey = crypto.randomBytes(32).toString('hex').toUpperCase();
    const fromAddress = addressTranscodeUtil.getAddressFromPrivateKey(fromPrivateKey);
    const toAddress = addressTranscodeUtil.getAddressFromPrivateKey(toPrivateKey);
    const txObject = transactionTranscodeUtil.getSendTxObject(fromAddress, toAddress, amount, tokenName, payload, gasPrice, gasLimit, expirationDate, nexusName, chainName);
    const tx = transactionTranscodeUtil.encodeSendTxWithSignature(txObject);
    // console.log('tx.length', tx.length);
    const expectedTx = {
      nexusName: nexusName,
      chainName: chainName,
      from: fromAddress,
      to: toAddress,
      amount: amount,
      tokenName: tokenName,
      payload: payload,
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      expirationDate: expirationDateUTCseconds,
    };
    const actualTx = transactionTranscodeUtil.decodeSendTxWithoutSignature(tx);
    delete actualTx.opcodeOffsets;
    delete actualTx.script;
    const expectedTxStr = JSON.stringify(expectedTx);
    const actualTxStr = JSON.stringify(actualTx);
    // console.log('expectedTxStr', expectedTxStr);
    // console.log('actualTxStr  ', actualTxStr);
    expect(actualTxStr).to.equal(expectedTxStr);
  });
  it('test unsigned transaction transcode OPCODES', () => {
    const tx = '076d61696e6e6574046d61696efd73010d000402313003000d00040231300300'+
          '0d00042353313131313131313131313131313131313131313131313131313131'+
          '3131313131313103000d00042f50324b376e3170566679335a4d536578747258'+
          '316e6a337859645251766a446e744547416631783262376836526b3403000d00'+
          '0408416c6c6f7747617303000d0004036761732d00012e010d00040231300300'+
          '0d0004074f50434f44455303000d00042f50324b376e3170566679335a4d5365'+
          '78747258316e6a337859645251766a446e744547416631783262376836526b34'+
          '03000d00042f50324b376e3170566679335a4d536578747258316e6a33785964'+
          '5251766a446e744547416631783262376836526b3403000d00041652756e7469'+
          '6d652e5472616e73666572546f6b656e7307000d00042f50324b376e31705666'+
          '79335a4d536578747258316e6a337859645251766a446e744547416631783262'+
          '376836526b3403000d0004085370656e6447617303000d0004036761732d0001'+
          '2e010b000000000c7068616E7461736D612D747300';

    // const expirationDate = new Date(0);
    // console.log('tx', tx);
    const expirationDateUTCseconds = 0;
    const script =
      '0D000402313003000D000402313003000D000423533131313131313131313131'+
      '313131313131313131313131313131313131313131313103000D00042F50324B'+
      '376E3170566679335A4D536578747258316E6A337859645251766A446E744547'+
      '416631783262376836526B3403000D000408416C6C6F7747617303000D000403'+
      '6761732D00012E010D000402313003000D0004074F50434F44455303000D0004'+
      '2F50324B376E3170566679335A4D536578747258316E6A337859645251766A44'+
      '6E744547416631783262376836526B3403000D00042F50324B376E3170566679'+
      '335A4D536578747258316E6A337859645251766A446E74454741663178326237'+
      '6836526B3403000D00041652756E74696D652E5472616E73666572546F6B656E'+
      '7307000D00042F50324B376E3170566679335A4D536578747258316E6A337859'+
      '645251766A446E744547416631783262376836526B3403000D0004085370656E'+
      '6447617303000D0004036761732D00012E010B';
    const nexusName = 'mainnet';
    const chainName = 'main';
    const tokenName = 'OPCODES';
    const gasPrice = 10;
    const gasLimit = 10;
    const amount = 10;
    const payload = '7068616E7461736D612D7473';
    const fromPrivateKey = '0000000000000000000000000000000000000000000000000000000000000000';
    const toPrivateKey = '0000000000000000000000000000000000000000000000000000000000000000';
    const fromAddress = addressTranscodeUtil.getAddressFromPrivateKey(fromPrivateKey);
    const toAddress = addressTranscodeUtil.getAddressFromPrivateKey(toPrivateKey);
    // const txObject = transactionTranscodeUtil.getSendTxObject(fromAddress, toAddress, amount, tokenName, payload, gasPrice, gasLimit, expirationDate, nexusName, chainName);
    // const tx = transactionTranscodeUtil.encodeSendTxWithSignature(txObject);
    // console.log('tx', tx);
    // expect(tx.length).to.equal(810);
    // expect(tx).to.equal(expectedHexTx);
    const expectedTx = {
      nexusName: nexusName,
      chainName: chainName,
      script: script,
      from: fromAddress,
      to: toAddress,
      amount: amount,
      tokenName: tokenName,
      payload: payload,
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      expirationDate: expirationDateUTCseconds,
      opcodeOffsets: [
        '13@0', '3@6', '13@8', '3@14', '13@16', '3@55', '13@57', '3@108', '13@110',
        '3@122', '13@124', '45@131', '46@134', '13@136', '3@142', '13@144', '3@155',
        '13@157', '3@208', '13@210', '3@261', '13@263', '7@289',
      ],
    };
    const actualTx = transactionTranscodeUtil.decodeSendTxWithoutSignature(tx);
    // delete actualTx.opcodeOffsets;
    // delete expectedTx.opcodeOffsets;
    const expectedTxStr = JSON.stringify(expectedTx);
    const actualTxStr = JSON.stringify(actualTx);
    // console.log('expectedTxStr', expectedTxStr);
    // console.log('actualTxStr  ', actualTxStr);
    expect(actualTx).to.deep.equal(expectedTx);
    expect(actualTxStr).to.equal(expectedTxStr);
  });
  it('test signed random message elliptic', () => {
    const getSign = (msgHex, privateKey) => {
      const msgHashHex = Buffer.from(msgHex, 'hex');
      const privateKeyBuffer = Buffer.from(privateKey, 'hex');
      const sig = curve.sign(msgHashHex, privateKeyBuffer);
      return sig.toHex();
    };

    const privateKey = crypto.randomBytes(32).toString('hex').toUpperCase();
    const transaction = crypto.randomBytes(32).toString('hex').toUpperCase();
    const txSignature = getSign(transaction, privateKey).toUpperCase();
    const signature = transactionSignUtil.sign(transaction, privateKey).toUpperCase();
    expect(signature).to.equal(txSignature);
  });

  it('test signed random message txObject', () => {
    const privateKey = crypto.randomBytes(32).toString('hex').toUpperCase();
    const txObject = new phantasmaJS.Transaction();
    const transaction = crypto.randomBytes(32).toString('hex').toUpperCase();
    const txSignature = txObject.getSign(transaction, privateKey).toUpperCase();
    const signature = transactionSignUtil.sign(transaction, privateKey).toUpperCase();
    expect(signature).to.equal(txSignature);
  });

  it('test signed transaction transcode', () => {
    const expirationDate = transactionTranscodeUtil.getExpirationDate();
    const expirationDateUTCseconds = transactionTranscodeUtil.getDateAsUTCSeconds(expirationDate);
    const nexusName = 'mainnet';
    const chainName = 'main';
    const tokenName = 'SOUL';
    const gasPrice = parseInt(crypto.randomBytes(4).toString('hex'), 16);
    const gasLimit = parseInt(crypto.randomBytes(4).toString('hex'), 16);
    const amount = parseInt(crypto.randomBytes(4).toString('hex'), 16);
    const payload = crypto.randomBytes(32).toString('hex').toUpperCase();
    const fromPrivateKey = crypto.randomBytes(32).toString('hex').toUpperCase();
    const toPrivateKey = crypto.randomBytes(32).toString('hex').toUpperCase();
    const fromAddress = addressTranscodeUtil.getAddressFromPrivateKey(fromPrivateKey);
    const toAddress = addressTranscodeUtil.getAddressFromPrivateKey(toPrivateKey);
    const txObject = transactionTranscodeUtil.getSendTxObject(fromAddress, toAddress, amount, tokenName, payload, gasPrice, gasLimit, expirationDate, nexusName, chainName);
    // const txToSign = transactionTranscodeUtil.encodeSendTxWithoutSignature(txObject);

    const transaction = transactionTranscodeUtil.encodeSendTxWithoutSignature(txObject);
    const txSignature = txObject.getSign(transaction, fromPrivateKey).toLowerCase();

    const signature = transactionSignUtil.sign(transaction, fromPrivateKey);
    expect(signature).to.equal(txSignature);

    txObject.sign(fromPrivateKey);
    // const signature = txObject.signatures[0].signature.toLowerCase();

    const tx = transactionTranscodeUtil.encodeSendTxWithSignature(txObject);
    // console.log('tx.length', tx.length);
    const expectedTx = {
      nexusName: nexusName,
      chainName: chainName,
      from: fromAddress,
      to: toAddress,
      amount: amount,
      tokenName: tokenName,
      payload: payload,
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      expirationDate: expirationDateUTCseconds,
      signatures: [
        {
          signatureType: 1,
          signatureHex: signature,
        },
      ],
    };
    const actualTx = transactionTranscodeUtil.decodeSendTxWithSignature(tx);
    delete actualTx.opcodeOffsets;
    delete actualTx.script;

    const expectedTxStr = JSON.stringify(expectedTx);
    const actualTxStr = JSON.stringify(actualTx);
    // console.log('expectedTxStr', expectedTxStr);
    // console.log('actualTxStr  ', actualTxStr);
    expect(actualTx).to.deep.equal(expectedTx);
    expect(actualTxStr).to.equal(expectedTxStr);
  });

  beforeEach(async () => {});

  afterEach(async () => {});
});
