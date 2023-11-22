'use strict';

const {phantasmaJS, ScriptBuilder, Address, Transaction} = require('phantasma-ts');

/*
 * based on address transcoding here:
 *
 * https://github.com/phantasma-io/phantasma-ts/blob/7d04aaed839851ae5640f68ab223ca7d92c42016/core/tx/utils.js
 */
const hex2ascii = (hexx) => {
  const hex = hexx.toString();
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    const char = hex.substr(i, 2);
    const charCode = String.fromCharCode(parseInt(char, 16));
    // console.log('char', char, 'charCode', charCode);
    str += charCode;
  }
  return str;
};

const decodeSendTxWithSignature = (tx) => {
  return decodeSendTx(tx, true);
};

const decodeSendTxWithoutSignature = (tx) => {
  return decodeSendTx(tx, false);
};

// https://github.com/phantasma-io/phantasma-ts/blob/5b529f9f897d0bd06b8a92225969d2542672e519/core/tx/Transaction.js#L26
const decodeSendTx = (tx, withSignature) => {
  const buffer = Buffer.from(tx, 'hex');
  let offset = 0;

  const getNextTx = () => {
    if (offset +1 > buffer.length) {
      throw Error(`offset '${offset}' + 1 exceeds buffer.length '${buffer.length}'`);
    }
    const next = buffer[offset];
    // console.log('getNextTx', offset, next);
    offset++;
    return next;
  };

  const getNextTxSubarray = (subarrayLength) => {
    if (offset + subarrayLength > buffer.length) {
      throw Error(`offset '${offset}' + subarrayLength '${subarrayLength}' exceeds buffer.length '${buffer.length}'`);
    }
    const subarray = buffer.subarray(offset, offset + subarrayLength);
    // console.log('getNextTxSubarray', offset, subarrayLength, buffer.length, subarray.toString('hex'));
    offset += subarrayLength;
    return subarray;
  };

  const getNextTxAscii = () => {
    return hex2ascii(getNextTxVariableLengthHex());
  };

  const getNextTxVariableLength = () => {
    return getNextTxSubarray(getNextTxVarInt());
  };

  const getNextTxVariableLengthHex = () => {
    return getNextTxVariableLength().toString('hex').toUpperCase();
  };

  // const getNextTxBase10Str = () => {
  //   return BigInt('0x' + getNextTxVariableLengthHex()).toString(10);
  // };

  // const getNextTxInteger = () => {
  //   return parseInt(getNextTxBase10Str(), 10);
  // };

  const getNextTxFixedLengthInteger = (subarrayLength) => {
    // console.log('getNextTxFixedLengthInteger', 'subarrayLength', subarrayLength);
    const subarray = getNextTxSubarray(subarrayLength);
    subarray.reverse();
    // console.log('getNextTxFixedLengthInteger', 'subarray', subarray.length, subarray.toString('hex'));
    return parseInt(BigInt('0x' + subarray.toString('hex')).toString(10), 10);
  };

  const getNextTxVarInt = () => {
    const b0 = getNextTx();
    // console.log('getNextTxVarInt', 'b0', b0, b0.toString(16));
    if (b0 < 0xfd) {
      return b0;
    }
    if (b0 == 0xfd) {
      return getNextTxFixedLengthInteger(2);
    }
    if (b0 == 0xfe) {
      return getNextTxFixedLengthInteger(3);
    }
    if (b0 == 0xff) {
      return getNextTxFixedLengthInteger(4);
    }
    throw Error(`unparseable b0:'${b0}'`);
  };

  const nexusName = getNextTxAscii();
  const chainName = getNextTxAscii();


  const getSignatures = () => {
    const signatures = [];
    const signaturesLength = getNextTxVarInt();
    for (let signatureIx = 0; signatureIx < signaturesLength; signatureIx++) {
      const signatureType = getNextTx();
      if (signatureType == 1) {
        const signatureLength = getNextTxVarInt();
        const signatureBytes = getNextTxSubarray(signatureLength);
        const signatureHex = signatureBytes.toString('hex');
        signatures.push({
          signatureType: signatureType,
          signatureHex: signatureHex,
        });
      }
      if (signatureType == 2) {
        const curveType = getNextTx();
        const signatureLength = getNextTxVarInt();
        const signatureBytes = getNextTxSubarray(signatureLength);
        const signatureHex = signatureBytes.toString('hex');
        signatures.push({
          curveType: curveType,
          signatureType: signatureType,
          signatureHex: signatureHex,
        });
      }
    }
    return signatures;
  };

  // console.log('decodeSendTx', 'scriptLength', scriptLength, scriptLength.toString(16));
  const script = getNextTxVariableLengthHex();
  // console.log('decodeSendTx', 'script', script);

  const scriptBuffer = Buffer.from(script, 'hex');
  let scriptOffset = 0;
  const opcodeOffsets = [];

  const getNextScript = () => {
    const next = scriptBuffer[scriptOffset];
    // console.log('getNextScript', scriptOffset, 'next', next.toString(16).padStart(2, '0'));
    scriptOffset++;
    return next;
  };

  const getNextOpcode = () => {
    const offset = scriptOffset;
    const opcode = getNextScript();
    opcodeOffsets.push(`${opcode}@${offset}`);
    return opcode;
  };

  const getNextScriptSubarray = (subarrayLength) => {
    if (scriptOffset + subarrayLength > buffer.length) {
      throw Error(`scriptOffset '${scriptOffset}' + subarrayLength '${subarrayLength}' exceeds scriptBuffer.length '${scriptBuffer.length}'`);
    }
    const subarray = scriptBuffer.subarray(scriptOffset, scriptOffset + subarrayLength);
    // console.log('getNextTxSubarray', offset, subarrayLength, buffer.length, subarray.toString('hex'));
    scriptOffset += subarrayLength;
    return subarray;
  };

  const readLoad = () => {
    const opCode = getNextOpcode();
    if (opCode !== 13) {
      throw Error(`expected opcode LOAD(13) actual '${opCode}'`);
    }
    const reg = getNextScript();
    const type = getNextScript();
    const bytesLength = getNextScript();
    const bytesBuffer = getNextScriptSubarray(bytesLength);
    const bytesHex = bytesBuffer.toString('hex');
    return {
      opCode: opCode,
      reg: reg,
      type: type,
      bytesLength: bytesLength,
      // bytesBuffer: bytesBuffer,
      bytesHex: bytesHex,
    };
  };

  const readPush = () => {
    const opCode = getNextOpcode();
    if (opCode !== 3) {
      throw Error(`expected opcode PUSH(3) actual '${opCode}'`);
    }
    const reg = getNextScript();
    return {
      opCode: opCode,
      reg: reg,
    };
  };

  const readCtx = () => {
    const opCode = getNextOpcode();
    if (opCode !== 45) {
      throw Error(`expected opcode CTX(45) actual '${opCode}'`);
    }
    const srcReg = getNextScript();
    const destReg = getNextScript();
    return {
      opCode: opCode,
      srcReg: srcReg,
      destReg: destReg,
    };
  };

  const readExtcall = () => {
    const opCode = getNextOpcode();
    if (opCode !== 7) {
      throw Error(`expected opcode EXTCALL(7) actual '${opCode}'`);
    }
    const destReg = getNextScript();
    return {
      opCode: opCode,
      destReg: destReg,
    };
  };

  const readSwitch = () => {
    const opCode = getNextOpcode();
    if (opCode !== 46) {
      throw Error(`expected opcode SWITCH(46) actual '${opCode}'`);
    }
    const destReg = getNextScript();
    return {
      opCode: opCode,
      destReg: destReg,
    };
  };

  const readLoadPush = () => {
    const load = readLoad();
    const push = readPush();
    return {
      load: load,
      push: push,
    };
  };

  const readMethodArgs = (argLength) => {
    const arr = [];
    for (let ix = 0; ix < argLength; ix++) {
      arr.push(readLoadPush());
    }
    return arr;
  };

  const readContract = (argLength) => {
    const args = readMethodArgs(argLength);
    const method =readLoadPush();
    const contractName = readLoad();
    const ctx = readCtx();
    const switchOp = readSwitch();
    return {
      args: args,
      method: method,
      contractName: contractName,
      ctx: ctx,
      switchOp: switchOp,
    };
  };

  const readInterop = (argLength) => {
    const args = readMethodArgs(argLength);
    const method = readLoad();
    const extcall = readExtcall();
    return {
      args: args,
      method: method,
      extcall: extcall,
    };
  };

  const expirationDate = getNextTxFixedLengthInteger(4);
  const payload = getNextTxVariableLengthHex();

  const allowGasContract = readContract(4);
  // console.log('decodeSendTx', 'allowGasContract', allowGasContract);
  const runtimeTransferTokensInterop = readInterop(4);
  // console.log('decodeSendTx', 'runtimeTransferTokensInterop', runtimeTransferTokensInterop);

  const from = hex2ascii(allowGasContract.args[3].load.bytesHex);
  const to = hex2ascii(runtimeTransferTokensInterop.args[2].load.bytesHex);
  const amount = parseInt(hex2ascii(runtimeTransferTokensInterop.args[0].load.bytesHex), 10);
  const tokenName = hex2ascii(runtimeTransferTokensInterop.args[1].load.bytesHex);
  const gasPrice = parseInt(hex2ascii(allowGasContract.args[1].load.bytesHex), 10);
  const gasLimit = parseInt(hex2ascii(allowGasContract.args[0].load.bytesHex), 10);

  const retval = {
    nexusName: nexusName,
    chainName: chainName,
    script: script,
    from: from,
    to: to,
    amount: amount,
    tokenName: tokenName,
    payload: payload,
    gasPrice: gasPrice,
    gasLimit: gasLimit,
    expirationDate: expirationDate,
    opcodeOffsets: opcodeOffsets,
  };
  if (withSignature) {
    const signatures = getSignatures();
    retval.signatures = signatures;
  }

  return retval;
};

const getDateAsUTCSeconds = (expirationDate) => {
  const expirationDateUTCms = Date.UTC(
      expirationDate.getUTCFullYear(),
      expirationDate.getUTCMonth(),
      expirationDate.getUTCDate(),
      expirationDate.getUTCHours(),
      expirationDate.getUTCMinutes(),
      expirationDate.getUTCSeconds());
  return expirationDateUTCms / 1000;
};

const getExpirationDate = () => {
  // TODO: make expirationDate configurable.
  const expirationMinutes = 5; // This is in minutes
  const expirationDate = new Date(Date.now() + (expirationMinutes * 60000));
  return expirationDate;
};

const getSendTxObject = (from, to, amount, tokenName, payload, gasPrice, gasLimit, expirationDate, nexusName, chainName) => {
  /* istanbul ignore if */
  if (from === undefined) {
    throw Error('from is a required parameter.');
  }
  /* istanbul ignore if */
  if (to === undefined) {
    throw Error('to is a required parameter.');
  }
  /* istanbul ignore if */
  if (amount === undefined) {
    throw Error('amount is a required parameter.');
  }
  /* istanbul ignore if */
  if (tokenName === undefined) {
    throw Error('tokenName is a required parameter.');
  }
  /* istanbul ignore if */
  if (payload === undefined) {
    throw Error('payload is a required parameter.');
  }
  /* istanbul ignore if */
  if (gasPrice === undefined) {
    throw Error('gasPrice is a required parameter.');
  }
  /* istanbul ignore if */
  if (gasLimit === undefined) {
    throw Error('gasLimit is a required parameter.');
  }
  /* istanbul ignore if */
  if (expirationDate === undefined) {
    throw Error('expirationDate is a required parameter.');
  }
  /* istanbul ignore if */
  if (nexusName === undefined) {
    throw Error('nexusName is a required parameter.');
  }
  /* istanbul ignore if */
  if (chainName === undefined) {
    throw Error('chainName is a required parameter.');
  }
  // Creating a new Script Builder Object
  const sb = new ScriptBuilder();
  sb.AllowGas(from, Address.Null, gasPrice, gasLimit)
      .CallInterop('Runtime.TransferTokens', [from, to, tokenName, String(amount)])
  // 10 000 000 000 = 1 KCAL
      .SpendGas(from)
      .EndScript();

  // Gives us a string version of the Script
  const script = sb.EndScript();

  console.log('getSendTxObject', 'scriptLength', script.length, script.length.toString(16));
  console.log('getSendTxObject', 'scriptLength/2', script.length/2, (script.length/2).toString(16));
  console.log('getSendTx', 'script', script);
  console.log('getSendTx', 'scriptAscii', hex2ascii(script));

  console.log('getSendTxObject', 'expirationDate', expirationDate);

  // Creating New Transaction Object
  const transaction = new Transaction(
      nexusName, // Nexus Name
      chainName, // Chain
      script, // In string format
      expirationDate, // Expiration Date
      payload); // Extra Info to attach to Transaction in Serialized Hex
  // console.log('getSendTxObject', 'transaction', transaction);
  return transaction;
};

const encodeSendTxWithSignature = (transaction) => {
  // console.log('encodeSendTx', 'transaction', transaction);
  const sendTx = transaction.toString(true);
  // console.log('encodeSendTx', 'sendTx', sendTx);
  return sendTx;
};

const encodeSendTxWithoutSignature = (transaction) => {
  const sendTx = transaction.toString(false);
  // console.log('encodeSendTx', 'sendTx', sendTx);
  return sendTx;
};

exports.getDateAsUTCSeconds = getDateAsUTCSeconds;
exports.getExpirationDate = getExpirationDate;
exports.encodeSendTxWithSignature = encodeSendTxWithSignature;
exports.encodeSendTxWithoutSignature = encodeSendTxWithoutSignature;
exports.decodeSendTxWithSignature = decodeSendTxWithSignature;
exports.decodeSendTxWithoutSignature = decodeSendTxWithoutSignature;
exports.getSendTxObject = getSendTxObject;
exports.hex2ascii = hex2ascii;
