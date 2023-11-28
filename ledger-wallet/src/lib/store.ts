import { writable, type Writable } from 'svelte/store';
import {
	PhantasmaAPI,
	ScriptBuilder,
	type Account,
	type AccountTransactions,
	type Paginated,
	type LedgerConfig,
	Base16
} from 'phantasma-ts';

export const WalletAddress = writable('');
export const WaleltPublicKey = writable('');
export const IsWalletConnected = writable(false);
export const NetworkSelected = writable('mainnet');
export const ExplorerURL = writable('https://explorer.phantasma.io/');

export const GasPrice = writable(100000);
export const GasLimit = writable(900);

export const ACCOUNT_INDEX = 0;

export let accountSigner = undefined;
export let accountData = undefined;
export let LedgerInUse = writable(false);

export const UserData: Writable<Account> = writable();
export const TransactionList: Writable<Paginated<AccountTransactions>> = writable();

export const DefaultRPC = new PhantasmaAPI(
	'https://testnet.phantasma.io/rpc',
	undefined,
	'testnet'
);
export const PhantasmaRPC = writable(
	new PhantasmaAPI('https://testnet.phantasma.io/rpc', undefined, 'testnet')
);

//export const GlobalTransportWebUSB = TransportWebUSB;
export const MyConfigWritable: Writable<LedgerConfig> = writable();
export const MyConfig: LedgerConfig = {
	Debug: false,
	Transport: undefined,
	RPC: DefaultRPC,
	Bip32Factory: undefined,
	Bip39: undefined,
	Curve: undefined,
	NexusName: 'testnet',
	ChainName: 'main',
	TokenNames: ['KCAL', 'SOUL'],
	GasPrice: 100000,
	GasLimit: 900,
	VerifyResponse: false,
	Payload: Base16.encode('Ledger')
};
