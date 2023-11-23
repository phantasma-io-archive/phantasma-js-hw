import {PhantasmaRPC, WalletAddress, UserData, TransactionList, GasLimit, GasPrice} from "$lib/store";
import { ScriptBuilder, type Balance, type PhantasmaAPI, Address } from "phantasma-ts";

let gasLimit = 900;
let gasPrice = 100000;
let walletAddress : string;
let phantasmaAPI : PhantasmaAPI;

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

export async function FetchUser(){
    if ( walletAddress == undefined || phantasmaAPI == undefined ||  walletAddress == "") return;
    const result = await phantasmaAPI.getAccount(walletAddress);
    UserData.set(result);
}

export async function FetchUserTransactions(page: number, pageSize: number){
    if ( walletAddress == undefined || phantasmaAPI == undefined || walletAddress == "" ) return;
    const result = await phantasmaAPI.getAddressTransactions(walletAddress, page, pageSize);
    TransactionList.set(result);
    return result;
}

export async function StakeSOUL(amount: number){
    if ( walletAddress == undefined || phantasmaAPI == undefined || walletAddress == "" ) return;
    const sb = new ScriptBuilder()
    .AllowGas(walletAddress, Address.Null, gasPrice, gasLimit)
    .CallContract("stake", "Stake", [walletAddress, amount])
    .SpendGas(walletAddress);
    const script = sb.EndScript();

    return result;
}

export async function UnStakeSOUL(amount: number){
    if ( walletAddress == undefined || walletAddress == "" ) return;
    const sb = new ScriptBuilder()
    .AllowGas(walletAddress, Address.Null, gasPrice, gasLimit)
    .CallContract("stake", "Unstake", [walletAddress, amount])
    .SpendGas(walletAddress);
    const script = sb.EndScript();

    return result;
}
