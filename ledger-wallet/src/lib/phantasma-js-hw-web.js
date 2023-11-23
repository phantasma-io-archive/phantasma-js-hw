window.phantasmaJsHw.getLedgerAccountSigner = async (accountIx) => {
	const config = window.phantasmaJsHwConfig;

	/* istanbul ignore if */
	if (config === undefined) {
		throw Error('config is a required parameter.');
	}
	/* istanbul ignore if */
	if (accountIx === undefined) {
		throw Error('accountIx is a required parameter.');
	}
	const paths = await window.TransportWebUSB.list();
	console.log('paths', paths);
	if (paths.length == 0) {
		alert('NUmber of devices found:' + paths.length);
		return;
	}
	let accountData = await window.phantasmaJsHw.getBalanceFromLedger(config, {
		verifyOnDevice: false,
		debug: true
	});
	const signer = {};
	signer.getPublicKey = () => {
		return accountData.publicKey;
	};
	signer.getAccount = () => {
		return accountData.address;
	};
	return signer;
};
