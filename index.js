'use strict';

// STARTED TOP nodejs/browser hack
(function() {
  // FINISHED TOP nodejs/browser hack
  const mnemonicUtil = require('./scripts/mnemonic.js');
  const hexToBytesTranscoder = require('./scripts/hex-to-bytes-transcoder.js');
  const addressTranscodeUtil = require('./scripts/address-transcode.js');
  const ledgerCommUtil = require('./scripts/ledger-comm.js');
  const transactionTranscodeUtil = require('./scripts/transaction-transcode.js');
  const transactionSignUtil = require('./scripts/transaction-sign.js');

  const leftPad = (number, length) => {
    let str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  };

  const toWholeNumber = (balance, decimals) => {
    if (balance === undefined) {
      throw Error('balance is a required parameter.');
    }
    if (decimals === undefined) {
      throw Error('decimals is a required parameter.');
    }
    // console.log('toWholeNumber', 'balance', balance);
    const paddedBalance = leftPad(balance, decimals+1);
    // console.log('toWholeNumber', 'paddedBalance', paddedBalance);
    const prefixLength = paddedBalance.length - decimals;
    // console.log('toWholeNumber', 'prefixLength', prefixLength);
    const prefix = paddedBalance.slice(0, prefixLength);
    // console.log('toWholeNumber', 'prefix', prefix);
    const suffix = paddedBalance.slice(-decimals);
    // console.log('toWholeNumber', 'suffix', suffix);
    return `${prefix}.${suffix}`;
  };

  const getLedgerDeviceInfo = async (config) => {
    if (config == undefined) {
      throw Error('config is a required parameter.');
    }
    const version = await ledgerCommUtil.getVersion(config.transport);
    const applicationName = await ledgerCommUtil.getApplicationName(config.transport);
    return {
      version: version,
      applicationName: applicationName,
    };
  };

  const getBalanceFromLedger = async (config, options) => {
    /* istanbul ignore if */
    if (config == undefined) {
      throw Error('config is a required parameter.');
    }
    /* istanbul ignore if */
    if (options == undefined) {
      throw Error('options is a required parameter.');
    }
    const msg = await ledgerCommUtil.getPublicKey(config.transport, options);
    /* istanbul ignore if */
    if (config.debug) {
      console.log('getBalanceFromLedger', 'msg', msg);
    }
    if (msg.success) {
      const publicKey = msg.publicKey;
      const address = addressTranscodeUtil.getAddressFromPublicKey(publicKey);
      /* istanbul ignore if */
      if (config.debug) {
        console.log('address', address);
      }
      // const path = `/address/${address}`;
      // const response = await httpRequestUtil.get(config, path);
      const rpcResponse = await config.rpc.getAccount(address);
      const response = {};
      response.balances = {};
      if (rpcResponse.balances !== undefined) {
        rpcResponse.balances.forEach((balanceElt) => {
          response.balances[balanceElt.symbol] = toWholeNumber(balanceElt.amount, balanceElt.decimals);
        });
      }
      response.address = address;
      response.success = true;
      // const lastRefPath = `/transaction/last-ref/${address}`;
      // const lastRefResponse = await httpRequestUtil.get(config, lastRefPath);
      // response.lastRef = lastRefResponse;
      return response;
    } else {
      return msg;
    }
  };

  const getPoltergeistMnemonic = async (config, mnemonic) => {
    /* istanbul ignore if */
    if (config == undefined) {
      throw Error('config is a required parameter.');
    }
    /* istanbul ignore if */
    if (mnemonic == undefined) {
      throw Error('mnemonic is a required parameter.');
    }
    const poltergeistMnemonic = mnemonicUtil.getPoltergeistMnemonic(config, mnemonic);

    const response = {};
    response.poltergeistMnemonic = poltergeistMnemonic;
    response.success = true;
    return response;
  };

  const getBalanceFromMnemonic = async (config, mnemonic, index) => {
    /* istanbul ignore if */
    if (config == undefined) {
      throw Error('config is a required parameter.');
    }
    /* istanbul ignore if */
    if (mnemonic == undefined) {
      throw Error('mnemonic is a required parameter.');
    }
    /* istanbul ignore if */
    if (index == undefined) {
      throw Error('index is a required parameter.');
    }
    /* istanbul ignore if */
    if (config.debug) {
      console.log('mnemonic', mnemonic);
    }
    const privateKey = mnemonicUtil.getPrivateKeyFromMnemonic(config, mnemonic, index);
    return await getBalanceFromPrivateKey(config, privateKey);
  };

  const getBalanceFromPrivateKey = async (config, privateKey) => {
    /* istanbul ignore if */
    if (config == undefined) {
      throw Error('config is a required parameter.');
    }
    /* istanbul ignore if */
    if (privateKey == undefined) {
      throw Error('privateKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (config.debug) {
      console.log('privateKey', privateKey);
    }
    // https://github.com/phantasma-io/phantasma-ts/blob/7d04aaed839851ae5640f68ab223ca7d92c42016/core/tx/utils.js
    const publicKey = transactionSignUtil.getPublicFromPrivate(privateKey);
    /* istanbul ignore if */
    if (config.debug) {
      console.log('publicKey', publicKey);
    }
    const address = addressTranscodeUtil.getAddressFromPublicKey(publicKey);
    /* istanbul ignore if */
    if (config.debug) {
      console.log('address', address);
    }
    // const path = `/address/${address}`;
    // const response = await httpRequestUtil.get(config, path);
    const rpcResponse = await config.rpc.getAccount(address);
    const response = {};
    response.balances = {};
    if (rpcResponse.balances !== undefined) {
      rpcResponse.balances.forEach((balanceElt) => {
        response.balances[balanceElt.symbol] = toWholeNumber(balanceElt.amount, balanceElt.decimals);
      });
    }
    response.address = address;
    response.success = true;
    // const lastRefPath = `/transaction/last-ref/${address}`;
    // const lastRefResponse = await httpRequestUtil.get(config, lastRefPath);
    // response.lastRef = lastRefResponse;
    return response;
  };

  const sendAmountUsingMnemonic = async (config, amount, tokenName, toAddress, mnemonic, index) => {
    /* istanbul ignore if */
    if (config == undefined) {
      throw Error('config is a required parameter.');
    }
    /* istanbul ignore if */
    if (amount == undefined) {
      throw Error('amount is a required parameter.');
    }
    /* istanbul ignore if */
    if (toAddress == undefined) {
      throw Error('toAddress is a required parameter.');
    }
    /* istanbul ignore if */
    if (tokenName == undefined) {
      throw Error('mnemonic is a required parameter.');
    }
    /* istanbul ignore if */
    if (mnemonic == undefined) {
      throw Error('mnemonic is a required parameter.');
    }
    /* istanbul ignore if */
    if (index == undefined) {
      throw Error('index is a required parameter.');
    }
    /* istanbul ignore if */
    if (config.debug) {
      console.log('sendAmountUsingMnemonic', 'mnemonic', mnemonic);
    }
    const privateKey = mnemonicUtil.getPrivateKeyFromMnemonic(config, mnemonic, index);
    /* istanbul ignore if */
    if (config.debug) {
      console.log('sendAmountUsingMnemonic', 'privateKey', privateKey);
    }
    const publicKey = transactionSignUtil.getPublicFromPrivate(privateKey);
    /* istanbul ignore if */
    if (config.debug) {
      console.log('sendAmountUsingMnemonic', 'publicKey', publicKey);
    }
    const address = addressTranscodeUtil.getAddressFromPublicKey(publicKey);
    /* istanbul ignore if */
    if (config.debug) {
      console.log('sendAmountUsingMnemonic', 'address', address);
    }
    const callback = {};
    callback.signEncodedTx = (encodedTx) => {
      return transactionSignUtil.sign(encodedTx, privateKey);
    };

    return await sendAmountUsingCallback(config, amount, tokenName, toAddress, address, publicKey, callback);
  };

  const sendAmountUsingLedger = async (config, amount, tokenName, toAddress) => {
    /* istanbul ignore if */
    if (config == undefined) {
      throw Error('config is a required parameter.');
    }
    /* istanbul ignore if */
    if (amount == undefined) {
      throw Error('amount is a required parameter.');
    }
    /* istanbul ignore if */
    if (tokenName == undefined) {
      throw Error('tokenName is a required parameter.');
    }
    /* istanbul ignore if */
    if (toAddress == undefined) {
      throw Error('toAddress is a required parameter.');
    }
    const options = {verifyOnDevice: false};
    /* istanbul ignore if */
    if (config.debug) {
      console.log('sendAmountUsingLedger', 'options', options);
    }
    const msg = await ledgerCommUtil.getPublicKey(config.transport, options);
    /* istanbul ignore if */
    if (config.debug) {
      console.log('sendAmountUsingLedger', 'msg', msg);
    }
    if (msg.success) {
      const publicKey = msg.publicKey;
      /* istanbul ignore if */
      if (config.debug) {
        console.log('sendAmountUsingLedger', 'publicKey', publicKey);
      }
      const address = addressTranscodeUtil.getAddressFromPublicKey(publicKey);
      /* istanbul ignore if */
      if (config.debug) {
        console.log('sendAmountUsingLedger', 'address', address);
      }

      const callback = {};
      callback.signEncodedTx = async (encodedTx) => {
        /* istanbul ignore if */
        if (config.debug) {
          console.log('sendAmountUsingLedger', 'signCallback', 'encodedTx', encodedTx);
          console.log('sendAmountUsingLedger', 'signCallback', 'config.transport', config.transport);
        }
        const response = await ledgerCommUtil.sign(config.transport, encodedTx);
        /* istanbul ignore if */
        if (config.debug) {
          console.log('sendAmountUsingLedger', 'signCallback', 'response', response);
        }
        if (response.success) {
          return response.signature;
          // resolve(Buffer.from(response.signature, 'hex'));
        } else {
          throw Error(response.message);
        }
      };

      return await sendAmountUsingCallback(config, amount, tokenName, toAddress, address, publicKey, callback);
    } else {
      /* istanbul ignore if */
      if (config.debug) {
        console.log('getBalanceFromLedger', 'error ', msg);
      }
      return msg;
    }
  };

  const sendAmountUsingCallback = async (config, amount, tokenName, toAddress, fromAddress, publicKey, callback) => {
    amount = Number(amount);

    const gasPrice = config.gasPrice;

    const gasLimit = config.gasLimit;

    const expirationDate = transactionTranscodeUtil.getExpirationDate();

    // no payload, could be a message.
    const payload = '20202020';

    if (!config.tokenNames.includes(tokenName)) {
      throw Error(`invalidTokenName tokenName:'${tokenName}', config.tokenNames:${JSON.stringify(config.tokenNames)}`);
    }

    const txObject = transactionTranscodeUtil.getSendTxObject(fromAddress, toAddress, amount, tokenName, payload, gasPrice, gasLimit, expirationDate, config.nexusName, config.chainName);
    const encodedTx = transactionTranscodeUtil.encodeSendTxWithoutSignature(txObject);
    const decodedTx = transactionTranscodeUtil.decodeSendTxWithoutSignature(encodedTx);

    /* istanbul ignore if */
    if (config.debug) {
      console.log('decodedTx', decodedTx);
    }

    try {
      /* istanbul ignore if */
      if (config.debug) {
        console.log('sendAmountUsingCallback', 'encodedTx', encodedTx);
      }

      const signature = await callback.signEncodedTx(encodedTx);
      // const hash = transactionSignUtil.getHash(encodedTx);
      /* istanbul ignore if */
      if (config.debug) {
        console.log('sendAmountUsingCallback', 'signature', signature);
      }

      if (config.verifyResponse) {
        const verifyResponse = transactionSignUtil.verify(encodedTx, signature, publicKey);
        if (verifyResponse == false) {
          throw Error(`invalidSignature encodedTx:'${encodedTx}', publicKey:'${publicKey}' signature:'${signature}'`);
        }
        /* istanbul ignore if */
        if (config.debug) {
          console.log('verifyResponse', verifyResponse);
        }
      }

      txObject.signatures.unshift({signature, kind: 1});

      /* istanbul ignore if */
      if (config.debug) {
        console.log('signedTx', txObject);
      }

      const encodedSignedTx = transactionTranscodeUtil.encodeSendTxWithSignature(txObject);
      const decodedSignedTx = transactionTranscodeUtil.decodeSendTxWithSignature(encodedSignedTx);
      if (config.debug) {
        console.log('decodedSignedTx', decodedSignedTx);
      }
      const txHash = await config.rpc.sendRawTransaction(encodedSignedTx);
      if (config.debug) {
        console.log('sendAmountUsingCallback', 'txHash', txHash);
      }

      const response = {};
      response.success = true;
      response.message = txHash;

      if (txHash.error !== undefined) {
        response.success = false;
      }

      /* istanbul ignore if */
      if (config.debug) {
        console.log('response', response);
      }
      return response;
    } catch (error) {
      if (config.debug) {
        console.log('error', error);
      }
      const errorResponse = {};
      errorResponse.success = false;
      errorResponse.message = error.message;
      return errorResponse;
    }
  };

  // STARTED BOTTOM nodejs/browser hack
  const exports = (() => {
    //     // istanbul ignore if
    const exports = {};
    exports.getBalanceFromMnemonic = getBalanceFromMnemonic;
    exports.getBalanceFromPrivateKey = getBalanceFromPrivateKey;
    exports.getBalanceFromLedger = getBalanceFromLedger;
    exports.getPoltergeistMnemonic = getPoltergeistMnemonic;
    exports.sendAmountUsingMnemonic = sendAmountUsingMnemonic;
    exports.sendAmountUsingLedger = sendAmountUsingLedger;
    exports.getLedgerDeviceInfo = getLedgerDeviceInfo;
    exports.getBip44Path = mnemonicUtil.getBip44Path;
    exports.hexToBytes = hexToBytesTranscoder.hexToBytes;
    exports.bytesToHex = hexToBytesTranscoder.bytesToHex;
    exports.hexToBuffer = hexToBytesTranscoder.hexToBuffer;
    exports.bufferToHex = hexToBytesTranscoder.bufferToHex;
    exports.getBip44PathMessage = ledgerCommUtil.getBip44PathMessage;
    exports.getAddressFromPublicKey = addressTranscodeUtil.getAddressFromPublicKey;
    return exports;
  })();
  /* istanbul ignore else */
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = exports;
  } else {
    window.phantasmajshw = exports;
  }
})();
// FINISHED BOTTOM nodejs/browser hack
