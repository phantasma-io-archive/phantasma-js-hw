'use strict';

// libraries
const crypto = require('crypto');
const chai = require('chai');
// const {phantasmaJS} = require('phantasma-ts');
// const wif = require('wif');

// modules
const expect = chai.expect;
const transactionSignUtil = require('../../scripts/transaction-sign.js');
// const transactionTranscodeUtil = require('../../scripts/transaction-transcode.js');

// openssl genpkey -algorithm ed25519 -outform DER | xxd -p -c64
// 302e020100300506032b657004220420 6c3c6e1bf93e05ad2a078c7d05b8a944fe071aec93e7337ca5102236c62ec701
// openssl genpkey -algorithm ed25519 -outform DER | xxd -p -c 64
// 302e020100300506032b657004220420 3ae15024559b33b9c20c946926475a9efcd0574c8206e70a9ddb4cd240c0438e
// openssl genpkey -algorithm ed25519 -outform DER | xxd -p -c 64
// 302e020100300506032b657004220420 c4d4c492e8c7084a86d58c2139527e35828c21b0f19ff1733ce4b2a12c42bc01

// 302A300506032B6570032100 507EBB05E143E6354111166F144790C69078E0B622C27098A52903245D300FB4
// 302A300506032B6570032100 11605690BD4691280DA0718ED8AFE7F41C0E35B434E48EB85F4F346325E7229C

// functions
describe('transaction sign', () => {
  it('DERtoPEM 1', () => {
    const privateKeyDer = '302e020100300506032b657004220420'+
    '6c3c6e1bf93e05ad2a078c7d05b8a944fe071aec93e7337ca5102236c62ec701';
    const privateKeyObj = crypto.createPrivateKey( {key: Buffer.from(privateKeyDer, 'hex'), format: 'der', type: 'pkcs8'} );
    const publicKeyObj = crypto.createPublicKey( {key: privateKeyObj, format: 'pem', type: 'sec1'} );
    const actualPublicKey = publicKeyObj.export({format: 'der', type: 'spki'}).toString('hex').toUpperCase();
    const expectedPublicKey = '302A300506032B657003210011605690BD4691280DA0718ED8AFE7F41C0E35B434E48EB85F4F346325E7229C';
    expect(actualPublicKey).to.equal(expectedPublicKey);
  });
  it('DERtoPEM 2', () => {
    const privateKeyDer = '302e020100300506032b657004220420'+
      '3ae15024559b33b9c20c946926475a9efcd0574c8206e70a9ddb4cd240c0438e';
    const privateKeyObj = crypto.createPrivateKey( {key: Buffer.from(privateKeyDer, 'hex'), format: 'der', type: 'pkcs8'} );
    const publicKeyObj = crypto.createPublicKey( {key: privateKeyObj, format: 'pem', type: 'sec1'} );
    const actualPublicKey = publicKeyObj.export({format: 'der', type: 'spki'}).toString('hex').toUpperCase();
    const expectedPublicKey = '302A300506032B6570032100507EBB05E143E6354111166F144790C69078E0B622C27098A52903245D300FB4';
    expect(actualPublicKey).to.equal(expectedPublicKey);
  });
  it('sign', () => {
    const privateKey = crypto.randomBytes(32).toString('hex').toUpperCase();
    const transaction = crypto.randomBytes(32).toString('hex').toUpperCase();
    // const hash = transactionSignUtil.getHash(transaction);
    const publicKey = transactionSignUtil.getPublicFromPrivate(privateKey);
    const signature = transactionSignUtil.sign(transaction, privateKey);
    const actualVerify = transactionSignUtil.verify(transaction, signature, publicKey);
    const expectedVerify = true;
    expect(actualVerify).to.equal(expectedVerify);
  });
  it('sign 1', () => {
    const privateKeyDer = '302e020100300506032b657004220420'+
    '6c3c6e1bf93e05ad2a078c7d05b8a944fe071aec93e7337ca5102236c62ec701';
    const privateKeyObj = crypto.createPrivateKey( {key: Buffer.from(privateKeyDer, 'hex'), format: 'der', type: 'pkcs8'} );
    const publicKeyObj = crypto.createPublicKey( {key: privateKeyObj, format: 'pem', type: 'sec1'} );
    const message = crypto.randomBytes(32);
    const signature = crypto.sign(undefined, message, privateKeyObj);
    const actualVerify = crypto.verify(undefined, message, publicKeyObj, signature);
    const expectedVerify = true;
    expect(actualVerify).to.equal(expectedVerify);
  });

  it('sign random', () => {
    const keyPair = crypto.generateKeyPairSync('ed25519');
    const privateKeyObj = keyPair.privateKey;
    const publicKeyObj = keyPair.publicKey;
    const message = crypto.randomBytes(32);
    const signature = crypto.sign(undefined, message, privateKeyObj);
    const actualVerify = crypto.verify(undefined, message, publicKeyObj, signature);
    const expectedVerify = true;
    expect(actualVerify).to.equal(expectedVerify);
  });

  beforeEach(async () => {});

  afterEach(async () => {});
});
