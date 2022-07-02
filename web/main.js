const ACCOUNT_INDEX = 0;

let accountSigner = undefined;
let accountData = undefined;
let ledgerInUse = false;

const phantasmaRPC = new window.phantasmaJS.PhantasmaAPI('https://testnet-rpc.phantasma.io/rpc', 'https://peers.phantasma.io/testnet-getpeers.json', 'testnet');

const config = {};
config.blockchainExplorer = 'http://testnet.phantasma.io/';
config.debug = false;
config.transport = window.TransportWebUSB;
config.rpc = phantasmaRPC;
config.bip32Factory = window.bip32Factory;
config.bip39 = window.bip39;
config.curve = window.tinySecp256k1;
config.scriptBuilder = new window.phantasmaJS.ScriptBuilder();
config.nexusName = 'testnet';
config.chainName = 'main';
config.tokenNames = ['KCAL', 'SOUL'];
config.gasPrice = 100000;
config.gasLimit = 900;
config.verifyResponse = false;

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
  clearAccountInfo();
  const TransportWebUSB = window.TransportWebUSB;
  const isSupportedFlag = await TransportWebUSB.isSupported();
  console.log('connectLedger', 'isSupportedFlag', isSupportedFlag);
  if (isSupportedFlag) {
    await window.TransportWebUSB.create();
    accountSigner = await window.phantasmaJsHw.getLedgerAccountSigner(
        ACCOUNT_INDEX,
    );
    accountData = {
      publicKey: accountSigner.getPublicKey(),
      account: accountSigner.getAccount(),
    };
    ledgerInUse = true;
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
      // await window.TransportWebUSB.create();
      withdrawResponseElt.innerText = 'CHECK LEDGER FOR SEND BLOCK APPROVAL\n';
      response = await window.phantasmaJsHw.sendAmountUsingLedger(config, withdrawAmount, tokenName, withdrawAccount);
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
  hide('checkLedger');
  hide('accountData');
  const isSupportedFlag = await window.TransportWebUSB.isSupported();
  if (isSupportedFlag) {
    show('checkLedger');
  } else {
    show('unsupportedLedger');
  }

  if (accountData !== undefined) {
    show('accountData');
  }
};
