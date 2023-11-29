import {
	PhantasmaRPC,
	WalletAddress,
	UserData,
	TransactionList,
	GasLimit,
	GasPrice,
	MyConfigWritable
} from '$lib/store';
import {
	ScriptBuilder,
	type Balance,
	type PhantasmaAPI,
	Address,
	type Account,
	type LedgerConfig,
	SendTransactionLedger,
	type LedgerBalanceFromLedgerResponse,
	type LedgerSendTransactionResponse
} from 'phantasma-ts';

let gasLimit = 900;
let gasPrice = 100000;
let walletAddress: string;
let phantasmaAPI: PhantasmaAPI;
let myConfig: LedgerConfig;

MyConfigWritable.subscribe((value) => {
	myConfig = value;
});

GasLimit.subscribe(async (value) => {
	gasLimit = value;
});

GasPrice.subscribe(async (value) => {
	gasPrice = value;
});

WalletAddress.subscribe(async (value) => {
	walletAddress = value;
	FetchUser();
});

PhantasmaRPC.subscribe(async (value) => {
	phantasmaAPI = value;
	FetchUser();
});

export async function FetchUser() {
	if (walletAddress == undefined || phantasmaAPI == undefined || walletAddress == '') return;
	const result = await phantasmaAPI.getAccount(walletAddress);
	UserData.set(result);
}

export async function FetchUserTransactions(page: number, pageSize: number) {
	if (walletAddress == undefined || phantasmaAPI == undefined || walletAddress == '') return;
	const result = await phantasmaAPI.getAddressTransactions(walletAddress, page, pageSize);
	TransactionList.set(result);
	return result;
}

export async function GetUserNFTS(symbol: string, nfts: string[]) {
	if (walletAddress == undefined || phantasmaAPI == undefined || walletAddress == '') return;
	const result = await phantasmaAPI.getNFTs(symbol, nfts);
	return result;
}

export async function SendTokens(
	to: string,
	symbol: string,
	amount: string
): Promise<LedgerSendTransactionResponse> {
	if (walletAddress == undefined || walletAddress == '')
		return { success: false, message: 'No wallet address' };
	const sb = new ScriptBuilder()
		.AllowGas(walletAddress, Address.Null, gasPrice, gasLimit)
		.CallInterop('Runtime.TransferTokens', [walletAddress, to, symbol, amount])
		.SpendGas(walletAddress);
	const script = sb.EndScript();

	const result = await SendTransactionLedger(myConfig, script);
	return result;
}

export async function StakeSOUL(amount: number): Promise<LedgerSendTransactionResponse> {
	if (walletAddress == undefined || phantasmaAPI == undefined || walletAddress == '')
		return { success: false, message: 'No wallet address' };
	const sb = new ScriptBuilder()
		.AllowGas(walletAddress, Address.Null, gasPrice, gasLimit)
		.CallContract('stake', 'Stake', [walletAddress, String(amount)])
		.SpendGas(walletAddress);
	const script = sb.EndScript();

	const result = await SendTransactionLedger(myConfig, script);
	return result;
}

export async function UnStakeSOUL(amount: number): Promise<LedgerSendTransactionResponse> {
	if (walletAddress == undefined || phantasmaAPI == undefined || walletAddress == '')
		return { success: false, message: 'No wallet address' };
	const sb = new ScriptBuilder()
		.AllowGas(walletAddress, Address.Null, gasPrice, gasLimit)
		.CallContract('stake', 'Unstake', [walletAddress, String(amount)])
		.SpendGas(walletAddress);
	const script = sb.EndScript();

	const result = await SendTransactionLedger(myConfig, script);
	return result;
}

export async function ClaimKCAL(): Promise<LedgerSendTransactionResponse> {
	if (walletAddress == undefined || phantasmaAPI == undefined || walletAddress == '')
		return { success: false, message: 'No wallet address' };
	const sb = new ScriptBuilder()
		.AllowGas(walletAddress, Address.Null, gasPrice, gasLimit)
		.CallContract('stake', 'Claim', [walletAddress, walletAddress])
		.SpendGas(walletAddress);
	const script = sb.EndScript();

	const result = await SendTransactionLedger(myConfig, script);
	return result;
}

export async function Timeout(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GetTransactionResult(hash: string) {
	if (phantasmaAPI == undefined) return;
	const result = await phantasmaAPI.getTransaction(hash);
	return result;
}
