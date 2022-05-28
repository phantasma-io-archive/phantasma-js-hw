'use strict';

// max length in bytes.
const MAX_SIGNED_TX_LEN = 1024;

const debug = false;

const bip44Path =
  '8000002C' +
  '80000273' + // 627
  '80000000' +
  '00000000' +
  '00000000';

const errorDescriptions = {
  '530C': 'Unlock Ledger Device',
  '6D02': 'App Not Open On Ledger Device',
  '6511': 'App Not Open On Ledger Device',
  '6E00': 'App Not Open On Ledger Device',
  '6A86': 'Incorrect Pip2',
  '6A87': 'Wrong Data Length',
  '6A88': 'No Data Length',
  '6A89': 'Wrong Main Data Length',
  '6A90': 'Incorrect Pip1',
  '6985': 'Tx Denied on Ledger',
  '6D06': 'Tx Decoding Buffer Underflow',
  'B000': 'Wrong response length on Ledger Device',
  'B002': 'Failed to display Address on Ledger Device',
  'B005': 'Failed to parse Transaction on Ledger Device',
  'B008': 'Failed to sign Transaction on Ledger Device',
  'B009': 'Wrong signing parmeters on Ledger Device',
};

const hex2ascii = (hexx) => {
  const hex = hexx.toString();// force conversion
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
};

const int2buffer = (i) => {
  let hex = i.toString(16).toUpperCase();
  if (hex.length % 2 == 1) {
    hex = '0' + hex;
  }
  return Buffer.from(hex, 'hex');
};

const getErrorMessage = (responseStr) => {
  const suffix = responseStr.slice(-4);
  if (errorDescriptions[suffix] !== undefined) {
    const description = errorDescriptions[suffix];
    return `[${suffix}] ${responseStr} ${description}`;
  } else {
    return `[${suffix}] ${responseStr} Unknown Error`;
  }
};

const getVersion = async (transport) => {
  const device = await getDevice(transport);
  if (device.enabled) {
    try {
      const request = Buffer.from('E003000000', 'hex');
      /* istanbul ignore if */
      if (debug) {
        console.log('exchange', 'request', request.toString('hex').toUpperCase());
      }
      const response = await device.device.exchange(request);
      const responseStr = response.toString('hex').toUpperCase();
      /* istanbul ignore if */
      if (debug) {
        console.log('exchange', 'response', responseStr);
      }
      let success = false;
      let message = '';
      let version = '';
      if (responseStr.endsWith('9000')) {
        success = true;
        message = responseStr;
        version = responseStr.substring(0, responseStr.length-4);
        version = hex2ascii(version);
      } else {
        message = getErrorMessage(responseStr);
      }
      return {
        success: success,
        message: message,
        version: version,
      };
    } catch (error) {
      /* istanbul ignore if */
      if (debug) {
        console.trace('getVersion', 'error', error);
      }
      return {
        success: false,
        message: error.message,
      };
    } finally {
      device.device.close();
    }
  }
  if (device.error) {
    return {
      success: false,
      message: device.message,
    };
  }
};

const getApplicationName = async (transport) => {
  const device = await getDevice(transport);
  if (device.enabled) {
    try {
      const request = Buffer.from('E004000000', 'hex');
      /* istanbul ignore if */
      if (debug) {
        console.log('exchange', 'request', request.toString('hex').toUpperCase());
      }
      const response = await device.device.exchange(request);
      const responseStr = response.toString('hex').toUpperCase();
      /* istanbul ignore if */
      if (debug) {
        console.log('exchange', 'response', responseStr);
      }
      let success = false;
      let message = '';
      let applicationName = '';
      if (responseStr.endsWith('9000')) {
        success = true;
        message = responseStr;
        applicationName = responseStr.substring(0, responseStr.length-4);
        applicationName = hex2ascii(applicationName);
      } else {
        message = getErrorMessage(responseStr);
      }
      return {
        success: success,
        message: message,
        applicationName: applicationName,
      };
    } catch (error) {
      /* istanbul ignore if */
      if (debug) {
        console.trace('getApplicationName', 'error', error);
      }
      return {
        success: false,
        message: error.message,
      };
    } finally {
      device.device.close();
    }
  }
  if (device.error) {
    return {
      success: false,
      message: device.message,
    };
  }
};

const getBip44PathMessage = (messagePrefix) => {
  /* istanbul ignore if */
  if (messagePrefix == undefined) {
    throw Error('messagePrefix is a required parameter.');
  }
  if (messagePrefix.length !== 4) {
    throw Error('messagePrefix must be of length 4.');
  }

  const bip44PathBuffer = Buffer.from(bip44Path, 'hex');
  const bip44PathBufferLen = 5;// bip44PathBuffer.length;
  const bip44PathBufferLenBuffer = int2buffer(bip44PathBufferLen);
  const payload = Buffer.concat([bip44PathBufferLenBuffer, bip44PathBuffer]);
  const payloadLen = int2buffer(payload.length);

  if (debug) {
    console.log('getBip44PathMessage', 'bip44PathBuffer', bip44PathBuffer.toString('hex').toUpperCase());
    console.log('getBip44PathMessage', 'bip44PathBufferLen', bip44PathBufferLen);
    console.log('getBip44PathMessage', 'bip44PathBufferLenBuffer', bip44PathBufferLenBuffer.toString('hex').toUpperCase());
    console.log('getBip44PathMessage', 'payload', payload.toString('hex').toUpperCase());
    console.log('getBip44PathMessage', 'payloadLen', payloadLen.toString('hex').toUpperCase());
  }

  const message = Buffer.concat([messagePrefix, payloadLen, payload]);
  return message;
};

const getPublicKey = async (transport, options) => {
  /* istanbul ignore if */
  if (transport == undefined) {
    throw Error('transport is a required parameter.');
  }
  /* istanbul ignore if */
  if (options == undefined) {
    throw Error('options is a required parameter.');
  }
  const device = await getDevice(transport);
  if (device.enabled) {
    try {
      let messagePrefix;
      if (options.verifyOnDevice) {
        messagePrefix = Buffer.from('E0050100', 'hex');
      } else {
        messagePrefix = Buffer.from('E0050000', 'hex');
      }
      const request = getBip44PathMessage(messagePrefix);
      // const message = Buffer.from('E005000000', 'hex');
      // const message = Buffer.from('E004000000', 'hex');
      /* istanbul ignore if */
      if (debug) {
        console.log('exchange', 'request', request.toString('hex').toUpperCase());
      }
      const response = await device.device.exchange(request);
      const responseStr = response.toString('hex').toUpperCase();
      /* istanbul ignore if */
      if (debug) {
        console.log('exchange', 'response', responseStr);
      }
      let success = false;
      let message = '';
      let publicKey = '';
      if (responseStr.endsWith('9000')) {
        success = true;
        message = responseStr;
        publicKey = responseStr.substring(0, 64);
      } else {
        message = getErrorMessage(responseStr);
      }
      return {
        success: success,
        message: message,
        publicKey: publicKey,
      };
    } catch (error) {
      /* istanbul ignore if */
      if (debug) {
        console.trace('getPublicKey', 'error', error);
      }
      return {
        success: false,
        message: error.message,
      };
    } finally {
      device.device.close();
    }
  }
  if (device.error) {
    return {
      success: false,
      message: device.message,
    };
  }
};

const getDevice = async (transport) => {
  /* istanbul ignore if */
  if (debug) {
    console.log('getDevice', 'transport', transport);
  }
  const supported = await transport.isSupported();
  /* istanbul ignore if */
  if (debug) {
    console.log('getDevice', 'supported', supported);
  }
  if (!supported) {
    return {
      enabled: false,
      error: true,
      message: 'Your computer does not support the ledger device.',
    };
  }
  const list = await transport.list();
  /* istanbul ignore if */
  if (debug) {
    console.log('getDevice', 'list', list);
  }
  if (list.length == 0) {
    return {
      enabled: false,
      error: true,
      message: 'No device connected.',
    };
  }
  const path = list[0];
  /* istanbul ignore if */
  if (debug) {
    console.log('getDevice', 'path', path);
  }
  const device = await transport.open(path);
  /* istanbul ignore if */
  if (debug) {
    console.log('getDevice', 'device', device);
  }
  return {
    enabled: true,
    error: false,
    device: device,
  };
};

const chunkString = (str, length) => {
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
};

const splitMessageIntoChunks = (ledgerMessage) => {
  const messages = [];

  messages.push(getBip44PathMessage(Buffer.from('E006' + '00' + '80', 'hex')));

  if (debug) {
    console.log('splitMessageIntoChunks', 'ledgerMessage.length', ledgerMessage.length);
  }

  // MAX 250, as theres 5 header bytes, and max total buffer size is 255.
  const bufferSize = 250 * 2;

  // ledgerMessage = ledgerMessage.substring(0,bufferSize);

  const chunks = chunkString(ledgerMessage, bufferSize);

  for (let chunkIx = 0; chunkIx < chunks.length; chunkIx++) {
    const chunk = chunks[chunkIx];
    const chunkNbr = chunkIx + 1;
    if (debug) {
      console.log('splitMessageIntoChunks', 'chunk.length', chunk.length);
    }
    const p1 = chunkNbr.toString(16).padStart(2, '0');
    if (debug) {
      console.log('splitMessageIntoChunks', 'p1', p1);
    }

    let p2;
    if (chunkNbr == chunks.length) {
      // LAST
      p2 = '00';
    } else {
      // MORE
      p2 = '80';
    }
    if (debug) {
      console.log('splitMessageIntoChunks', 'p2', p2);
    }

    const chunkLength = chunk.length / 2;

    const chunkLengthHex = chunkLength.toString(16).padStart(2, '0');

    if (debug) {
      console.log('splitMessageIntoChunks', 'chunkLengthHex', chunkLengthHex);
    }

    const messageHex = 'E006' + p1 + p2 + chunkLengthHex + chunk;

    if (debug) {
      console.log('splitMessageIntoChunks', 'messageHex', messageHex);
    }
    const message = Buffer.from(messageHex, 'hex');
    if (debug) {
      console.log('splitMessageIntoChunks', 'message', message);
    }
    messages.push(message);
  }

  return messages;
};

const decodeSignature = (response) => {
  /* istanbul ignore if */
  if (debug) {
    console.log('decodeSignature', 'response', response);
  }
  const signature = response.substring(0, 128);
  /* istanbul ignore if */
  if (debug) {
    console.log('decodeSignature', 'signature', signature);
  }
  return signature;
};

const sign = async (transport, transactionHex) => {
  /* istanbul ignore if */
  if (debug) {
    console.log('sign', 'transactionHex', transactionHex);
  }
  // transactionHex = '0200000000000000';
  const transactionByteLength = Math.ceil(transactionHex.length / 2);
  if (transactionByteLength > MAX_SIGNED_TX_LEN) {
    return {
      success: false,
      message: `Transaction length of ${transactionByteLength} bytes exceeds max length of ${MAX_SIGNED_TX_LEN} bytes. Send less candidates and consolidate utxos.`,
    };
  }

  const ledgerMessage = transactionHex;

  const messages = splitMessageIntoChunks(ledgerMessage);

  const device = await getDevice(transport);
  if (device.enabled) {
    try {
      let lastResponse = undefined;
      // console.log('deviceThenCallback', 'messages', messages);
      for (let ix = 0; ix < messages.length; ix++) {
        const message = messages[ix];
        /* istanbul ignore if */
        if (debug) {
          console.log('exchange', ix, 'of', messages.length, 'message', message.toString('hex').toUpperCase());
        }

        const response = await device.device.exchange(message);
        const responseStr = response.toString('hex').toUpperCase();
        // console.log('exchange', 'request', request);
        // console.log('exchange', 'response', responseStr);
        /* istanbul ignore if */
        if (debug) {
          console.log('exchange', ix, 'of', messages.length, 'response', responseStr);
        }
        if (responseStr !== undefined) {
          if (!responseStr.endsWith('9000')) {
            const message = getErrorMessage(responseStr);
            device.close();
            callback({
              success: false,
              message: message,
              signature: '',
            });
            return;
          }
        }

        lastResponse = responseStr;
      }
      let signature = undefined;
      let success = false;
      let message = lastResponse;
      if (lastResponse !== undefined) {
        if (lastResponse.endsWith('9000')) {
          signature = decodeSignature(lastResponse);
          success = true;
        } else {
          message = getErrorMessage(lastResponse);
        }
      }

      return {
        success: success,
        message: message,
        signature: signature,
      };
    } catch (error) {
      /* istanbul ignore if */
      if (debug) {
        console.trace('sign', 'error', error);
      }
      return {
        success: false,
        message: error.message,
      };
    } finally {
      device.device.close();
    }
  }
  if (device.error) {
    return {
      success: false,
      message: device.message,
    };
  }
};

exports.getBip44PathMessage = getBip44PathMessage;
exports.getPublicKey = getPublicKey;
exports.getVersion = getVersion;
exports.getApplicationName = getApplicationName;
exports.sign = sign;
