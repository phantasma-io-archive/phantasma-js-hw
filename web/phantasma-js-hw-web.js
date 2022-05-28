

window.phantasmaJsHw.getLedgerAccountSigner = async (accountIx) => {
  const config = window.phantasmaJsHwConfig;
  // const getBip44Path = window.phantasmaJsHw.getBip44Path;
  // const TransportWebUSB = window.TransportWebUSB;

  /* istanbul ignore if */
  if (config === undefined) {
    throw Error('config is a required parameter.');
  }
  /* istanbul ignore if */
  if (accountIx === undefined) {
    throw Error('accountIx is a required parameter.');
  }
  await window.TransportWebUSB.create();
  const paths = await window.TransportWebUSB.list();
  console.log('paths', paths);
  if (paths.length == 0) {
    alert('NUmber of devices found:' + paths.length);
    return;
  }
  // const path = paths[0];
  // let accountData;
  // const device = await window.TransportWebUSB.create();
  // console.log('device', device);
  // try {
  //   const messagePrefix = window.phantasmaJsHw.hexToBuffer('E0050000');
  //   const message = window.phantasmaJsHw.getBip44PathMessage(messagePrefix);
  //   const responseBytes = await device.exchange(message);
  //   const response = window.phantasmaJsHw.bufferToHex(responseBytes);
  //   console.log('response', response);
  //   accountData = {};
  //   if (response.endsWith('9000')) {
  //     success = true;
  //     accountData.message = response;
  //     accountData.publicKey = response.substring(0, 64);
  //     accountData.address = window.phantasmaJsHw.getAddressFromPublicKey(accountData.publicKey);
  //   } else {
  //     accountData.message = getErrorMessage(responseStr);
  //   }
  // accountData = {
  //   publicKey:'',
  //   address:'',
  // }
  accountData = await window.phantasmaJsHw.getBalanceFromLedger(config, {verifyOnDevice: false});
  // } finally {
  //   device.close();
  // }
  const signer = {};
  signer.getPublicKey = () => {
    return accountData.publicKey;
  };
  signer.getAccount = () => {
    return accountData.address;
  };
  return signer;
};
