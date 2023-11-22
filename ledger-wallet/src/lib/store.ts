import { writable  } from "svelte/store";
import { PhantasmaAPI, ScriptBuilder } from "phantasma-ts";

export const WalletAddress = writable("");
export const WaleltPublicKey = writable("");
export const IsWalletConnected = writable(false);
export const NetworkSelected = writable("mainnet");

export const ACCOUNT_INDEX = 0;

export let accountSigner = undefined;
export let accountData = undefined;
export let LedgerInUse = writable(false);

export const PhantasmaRPC = writable(new PhantasmaAPI('https://testnet.phantasma.io/rpc', undefined, 'testnet'));

//export const GlobalTransportWebUSB = TransportWebUSB;
export const MyConfigWritable = writable({});
export const MyConfig =  {
    blockchainExplorer: 'https://testnet.phantasma.io/',
    debug: false,
    transport: undefined,
    rpc: PhantasmaRPC,
    bip32Factory: undefined,
    bip39: undefined,
    curve: undefined,
    scriptBuilder: new ScriptBuilder(),
    nexusName: 'testnet',
    chainName: 'main',
    tokenNames: ['KCAL', 'SOUL'],
    gasPrice: 100000,
    gasLimit: 900,
    verifyResponse: false,
    tokenNameSelected: "KCAL"
};