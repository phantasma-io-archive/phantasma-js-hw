const ACCOUNT_INDEX = 0;

let accountSigner = undefined;
let accountData = undefined;
let ledgerInUse = false;

// const phantasmaRPC = new window.phantasmaJS.PhantasmaAPI('https://seed.ghostdevs.com:7077/rpc', 'https://ghostdevs.com/getpeers.json', 'mainnet');

const config = {};
config.blockchainExplorer = 'https://explorer.phantasma.io/nexus';
config.debug = false;
config.transportNodeHid = {
  default: window.TransportWebUSB,
};
config.rpc = {
  getAccount: (address) => {
    return `https://explorer.phantasma.io/address/${address}#tab_transactions`;
  },
};
config.bip32Factory = window.bip32Factory;
config.bip39 = window.bip39;
config.curve = window.tinySecp256k1;
config.scriptBuilder = new window.phantasmaJS.ScriptBuilder();
config.nexusName = 'mainnet';
config.chainName = 'main';
config.tokenNames = ['KCAL', 'SOUL'];
config.gasPrice = 100000;
config.gasLimit = 900;

window.phantasmaJsHwConfig = config;

window.onLoad = async () => {
  await synchUI();
};

window.checkLedger = async () => {
  try {
    await checkLedgerOrError();
  } catch (error) {
    console.trace(error);
  }
};

const clearAllPasswordInfo = () => {
  clearNewPasswordInfo();
  document.getElementById('oldSeedPassword').value = '';
};

const clearNewPasswordInfo = () => {
  document.getElementById('newSeed').value = '';
  document.getElementById('newSeedPassword').value = '';
};

const clearAccountInfo = async () => {
  accountSigner = undefined;
  accountData = undefined;
  document.getElementById('accountInfo').innerText = '';
  document.getElementById('withdrawAmount').value = '';
  document.getElementById('withdrawAccount').value = '';
  await synchUI();
};

const getAccountInfo = async () => {
  const accountInfoElt = document.getElementById('accountInfo');
  const account = accountData.account;
  let innerHTML = `${account}\n<br>`;
  innerHTML += `Transactions (opens in new view):<br>`;
  innerHTML += `<a target="_blank" href="https://explorer.phantasma.io/address/${account}#tab_transactions">`;
  innerHTML += `${account}`;
  innerHTML += `</a>`;

  const withdrawAmountElt = document.getElementById('withdrawAmount');
  withdrawAmountElt.value = 1;
  const withdrawAccountElt = document.getElementById('withdrawAccount');
  withdrawAccountElt.value = account;

  accountInfoElt.innerHTML = innerHTML;
  await synchUI();
};

window.checkLedgerOrError = async () => {
  clearAllPasswordInfo();
  clearAccountInfo();
  const TransportWebUSB = window.TransportWebUSB;
  const isSupportedFlag = await TransportWebUSB.isSupported();
  console.log('connectLedger', 'isSupportedFlag', isSupportedFlag);
  if (isSupportedFlag) {
    accountSigner = await window.phantasmaJsHw.getLedgerAccountSigner(
        ACCOUNT_INDEX,
    );
    accountData = {
      publicKey: accountSigner.getPublicKey(),
      account: accountSigner.getAccount(),
    };
    ledgerInUse = true;
    clearAllPasswordInfo();
    await synchUI();
    console.log('connectLedger', 'accountData', accountData);
    await getAccountInfo();
  }
};

window.withdraw = async () => {
  const withdrawAccountElt = document.querySelector('#withdrawAccount');
  const withdrawAmountElt = document.querySelector('#withdrawAmount');
  const withdrawResponseElt = document.querySelector('#withdrawResponse');
  const withdrawAccount = withdrawAccountElt.value;
  const withdrawAmount = withdrawAmountElt.value;
  try {
    let response;
    if (ledgerInUse) {
      const tokenName = 'KCAL';
      await window.TransportWebUSB.create();
      withdrawResponseElt.innerText = 'CHECK LEDGER FOR SEND BLOCK APPROVAL\n';
      response = await phantasmaJsHw.sendAmountUsingLedger(config, withdrawAmount, tokenName, withdrawAccount);
    } else {
      withdrawResponseElt.innerText = 'NOT SUPPORTED\n';
    }
    console.log('withdraw', 'response', response);
    withdrawResponseElt.innerText = 'Response' + JSON.stringify(response);
  } catch (error) {
    console.log('withdraw', 'error', error);
    withdrawResponseElt.innerText = 'Error:' + error.message;
  }
};

const setAccountSignerDataFromSeed = async (seed) => {
  const privateKey = await window.phantasmaJsHw.getPrivateKey(seed, 0);
  const publicKey = await window.phantasmaJsHw.getPublicKey(privateKey);
  const account = window.phantasmaJsHw.getAccount(publicKey);

  accountSigner = privateKey;
  accountData = {
    publicKey: publicKey,
    account: account,
  };
  await getAccountInfo();
};

const setAccountSignerDataFromMnemonic = async (mnemonic) => {
  const seed = window.bip39.mnemonicToEntropy(mnemonic);
  await setAccountSignerDataFromSeed(seed);
};

window.checkOldSeed = async () => {
  clearAccountInfo();
  clearNewPasswordInfo();
  const encryptedSeed = window.localStorage.getItem('encryptedSeed');
  if (encryptedSeed == undefined) {
    alert('no seed found in local storage');
  } else {
    const oldSeedPassword = document.getElementById('oldSeedPassword').value;
    console.log('checkOldSeed', 'encryptedSeed', encryptedSeed);
    console.log('checkOldSeed', 'oldSeedPassword', oldSeedPassword);
    try {
      unencryptedSeed = await window.passwordUtils.decryptData(
          encryptedSeed,
          oldSeedPassword,
      );
      console.log('checkOldSeed', 'unencryptedSeed', unencryptedSeed);
      // alert(unencryptedSeed);
      const balance = await window.phantasmaJsHw.getBalanceFromPrivateKey(config, unencryptedSeed);
      alert(balance);
      // await setAccountSignerDataFromSeed(unencryptedSeed);
    } catch (error) {
      console.trace('checkOldSeed', 'error', error);
      alert(error.message);
    }
  }
};

window.clearOldSeed = async () => {
  const encryptedSeed = window.localStorage.getItem('encryptedSeed');
  if (encryptedSeed == undefined) {
    alert('no seed found in local storage');
  } else {
    if (confirm('Clear saved seed, are you sure? This is not reversible.')) {
      window.localStorage.removeItem('encryptedSeed');
    }
  }
  clearAllPasswordInfo();
  clearAccountInfo();
};

window.newRandomSeed = async () => {
  const seedBytes = new Uint8Array(32);
  window.crypto.getRandomValues(seedBytes);
  const seed = window.phantasmaJsHw.bytesToHex(seedBytes);
  document.getElementById('newSeed').value = seed;
};

window.checkNewSeed = async () => {
  clearAccountInfo();
  const newSeed = document.getElementById('newSeed').value;
  const newSeedPassword = document.getElementById('newSeedPassword').value;
  console.log('checkNewSeed', 'newSeed', newSeed);
  console.log('checkNewSeed', 'newSeedPassword', newSeedPassword);
  const encryptedSeed = await window.passwordUtils.encryptData(
      newSeed,
      newSeedPassword,
  );
  window.localStorage.setItem('encryptedSeed', encryptedSeed);
  console.log('checkNewSeed', 'encryptedSeed', encryptedSeed);
  console.log(
      'checkNewSeed',
      'localStorage.encryptedSeed',
      window.localStorage.getItem('encryptedSeed'),
  );
  unencryptedSeed = await window.passwordUtils.decryptData(
      encryptedSeed,
      newSeedPassword,
  );
  console.log('checkNewSeed', 'unencryptedSeed', unencryptedSeed);
  // alert(unencryptedSeed);
  document.getElementById('oldSeedPassword').value = newSeedPassword;
  clearNewPasswordInfo();


  const balance = await window.phantasmaJsHw.getBalanceFromPrivateKey(config, unencryptedSeed);
  alert(balance);

  // await setAccountSignerDataFromSeed(unencryptedSeed);
};

window.checkOldMnemonic = async () => {
  clearAccountInfo();
  clearNewPasswordInfo();
  const encryptedMnemonic = window.localStorage.getItem('encryptedMnemonic');
  if (encryptedMnemonic == undefined) {
    alert('no mnemonic found in local storage');
  } else {
    const oldMnemonicPassword = document.getElementById('oldMnemonicPassword').value;
    console.log('checkOldMnemonic', 'encryptedMnemonic', encryptedMnemonic);
    console.log('checkOldMnemonic', 'oldMnemonicPassword', oldMnemonicPassword);
    try {
      unencryptedMnemonic = await window.passwordUtils.decryptData(
          encryptedMnemonic,
          oldMnemonicPassword,
      );
      console.log('checkOldMnemonic', 'unencryptedMnemonic', unencryptedMnemonic);
      // alert(unencryptedMnemonic);
      // const balance = await window.phantasmaJsHw.getBalanceFromMnemonic(config, unencryptedMnemonic, 0);

      await setAccountSignerDataFromMnemonic(unencryptedMnemonic);
    } catch (error) {
      console.trace('checkOldMnemonic', 'error', error);
      alert(error.message);
    }
  }
};

window.clearOldMnemonic = async () => {
  const encryptedMnemonic = window.localStorage.getItem('encryptedMnemonic');
  if (encryptedMnemonic == undefined) {
    alert('no mnemonic found in local storage');
  } else {
    if (confirm('Clear saved mnemonic, are you sure? This is not reversible.')) {
      window.localStorage.removeItem('encryptedMnemonic');
    }
  }
  clearAllPasswordInfo();
  clearAccountInfo();
};

window.newRandomMnemonic = async () => {
  const seedBytes = new Uint8Array(32);
  window.crypto.getRandomValues(seedBytes);
  const seed = window.phantasmaJsHw.bytesToHex(seedBytes);
  const mnemonic = window.bip39.entropyToMnemonic(seed);
  document.getElementById('newMnemonic').value = mnemonic;
};

window.checkNewMnemonic = async () => {
  clearAccountInfo();
  const newMnemonic = document.getElementById('newMnemonic').value;
  const newMnemonicPassword = document.getElementById('newMnemonicPassword').value;
  console.log('checkNewMnemonic', 'newMnemonic', newMnemonic);
  console.log('checkNewMnemonic', 'newMnemonicPassword', newMnemonicPassword);
  const encryptedMnemonic = await window.passwordUtils.encryptData(
      newMnemonic,
      newMnemonicPassword,
  );
  window.localStorage.setItem('encryptedMnemonic', encryptedMnemonic);
  console.log('checkNewMnemonic', 'encryptedMnemonic', encryptedMnemonic);
  console.log(
      'checkNewMnemonic',
      'localStorage.encryptedMnemonic',
      window.localStorage.getItem('encryptedMnemonic'),
  );
  unencryptedMnemonic = await window.passwordUtils.decryptData(
      encryptedMnemonic,
      newMnemonicPassword,
  );
  console.log('checkNewMnemonic', 'unencryptedMnemonic', unencryptedMnemonic);
  // alert(unencryptedMnemonic);
  document.getElementById('oldMnemonicPassword').value = newMnemonicPassword;
  clearNewPasswordInfo();
  await setAccountSignerDataFromMnemonic(unencryptedMnemonic);
};

const synchUI = async () => {
  const hide = (id) => {
    document
        .getElementById(id)
        .setAttribute('class', 'border_black display_none');
  };
  const show = (id) => {
    document.getElementById(id).setAttribute('class', 'border_black');
  };
  hide('unsupportedLedger');
  hide('unsupportedCrypto');
  hide('checkLedger');
  hide('checkOldSeed');
  hide('clearOldSeed');
  hide('checkNewSeed');
  hide('checkOldMnemonic');
  hide('clearOldMnemonic');
  hide('checkNewMnemonic');
  hide('accountData');
  const isSupportedFlag = await window.TransportWebUSB.isSupported();
  if (isSupportedFlag) {
    show('checkLedger');
  } else {
    show('unsupportedLedger');
  }

  if (window.passwordUtils.enabled()) {
    const encryptedSeed = window.localStorage.getItem('encryptedSeed');
    console.log('synchUI', 'encryptedSeed', encryptedSeed);
    if (encryptedSeed == undefined) {
      show('checkNewSeed');
    } else {
      show('checkOldSeed');
      show('clearOldSeed');
    }
    const encryptedMnemonic = window.localStorage.getItem('encryptedMnemonic');
    console.log('synchUI', 'encryptedMnemonic', encryptedMnemonic);
    if (encryptedMnemonic == undefined) {
      show('checkNewMnemonic');
    } else {
      show('checkOldMnemonic');
      show('clearOldMnemonic');
    }
  } else {
    show('unsupportedCrypto');
  }

  if (accountData !== undefined) {
    show('accountData');
  }
};
