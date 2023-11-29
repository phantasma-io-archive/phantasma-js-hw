<script lang="ts">
    import {PhantasmaRPC, WalletAddress, UserData, MyConfig, MyConfigWritable} from "$lib/store";
	import { type Account, type Balance, PhantasmaAPI, Address, SendTransactionLedger, type LedgerConfig } from "phantasma-ts";
	import { onMount } from "svelte";
	import { FetchUser, GetTransactionResult, SendTokens, Timeout } from "$lib/Commands";
    import {NotificationError, NotificationSuccess, NotificationWarning} from "$lib/NotificationsBuilder";

    export let isModalOpen = true;
    let phantasmaAPI : PhantasmaAPI;
    let walletAddress = "";
    let destinationAddress = "";
    let amount = 0;
    let userBalances : Array<Balance> = []; 
    let userData : Account;
    let isInputValid = false;
    let isAddressValid = false;
    let myConfig : LedgerConfig;
    let symbol = "";

    MyConfigWritable.subscribe(value => {
        myConfig = value;
    });

    UserData.subscribe(value => {
        userData = value;
    });

    PhantasmaRPC.subscribe(async (value) => {
        phantasmaAPI = value;
        await LoadUserData();
    });

    WalletAddress.subscribe(value => {
        walletAddress = value;
    });

    async function LoadUserData(){
        userBalances = [];
        if ( walletAddress == null || walletAddress == undefined )
            return;

        if ( userData == null || userData == undefined )
            return;
        userBalances = userData.balances;
    }

    onMount(async () => {
        await LoadUserData();
    });
    

    function valdiateAddress(){
        isAddressValid = false;
        if ( destinationAddress == null || destinationAddress == undefined || destinationAddress == "" )
            return false;
        if (!Address.IsValidAddress(destinationAddress))
            return false;
        isAddressValid = true;
        return true;
    }

    function validateInput(){
        isInputValid = false;

        if ( destinationAddress == null || destinationAddress == undefined || destinationAddress == "" )
            return false;
            
        if ( amount == null || amount == undefined || amount <= 0 )
            return false;

        isInputValid = true;
        return true;
    }

    function FindBalance(symbol : string) : Balance{
        for ( let balance of userBalances ){
            if ( balance.symbol == symbol )
                return balance;
        }

        return null as unknown as Balance;
    }

    async function sendTokens(){

        if ( !isAddressValid )
        {
            NotificationError("Error Sending Tokens", "Invalid Address");
            return;
        }

        let balanceForSymbol = FindBalance(symbol);
        if ( balanceForSymbol == null || balanceForSymbol == undefined )
        {
            NotificationError("Error Sending Tokens", `No balance for ${symbol}`);
            return;
        }

        if ( Number(balanceForSymbol.amount) < amount )
        {
            NotificationError("Error Sending Tokens", `Insufficient balance for ${symbol}, you have ${Number(balanceForSymbol.amount) / 10 ** balanceForSymbol.decimals}`);
            return;
        }

        NotificationWarning("Send Tokens", "Please check your wallet to confirm the transaction.");

        let amountFixed = amount * 10 ** balanceForSymbol.decimals;
        let result = await SendTokens(destinationAddress, symbol, String(amountFixed));

        // Trigger a refresh of the user data
        if ( result.success ) {
            NotificationWarning("Fetching Transaction", `Please wait while we fetch the transaction.`);
            await Timeout(5 * 1000); // Wait 5 seconds for the transaction to be processed
            let transaction = await GetTransactionResult(result.message);
            if (transaction?.state == "Halt")
            {
                await FetchUser();
                NotificationSuccess("Tokens Sent", `Successfully sent ${amount} ${symbol} to ${destinationAddress}`);
            }else {
                NotificationError("Error Sending Tokens", `Failed to send ${amount} ${symbol} to ${destinationAddress}`);
            }
        }else {
            NotificationError("Transaction Canceled", `Transaction canceled to send ${amount} ${symbol} to ${destinationAddress}`);
        }

        closeModal();
    }

    function closeModal(){
        isModalOpen = false;
    }

</script>
<!-- Send Tokens Section -->

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div aria-hidden="true"  id="stakingModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" on:click={closeModal}>
    <div aria-hidden="true" class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" on:click|stopPropagation>

        <div class="my-6 bg-white p-4 shadow rounded w-full">
            <h2 class="text-xl font-semibold mb-3">Send Tokens</h2>
            <div>
                <label class="block mb-2 text-sm font-bold text-gray-700" for="destinationAddress">Destination Address:</label>
                <input 
                on:change={valdiateAddress}
                on:keydown={valdiateAddress}
                bind:value={destinationAddress}
                class:border-red-600={!isAddressValid}
                class="shadow appearance-none border rounded  w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="destinationAddress" type="text" placeholder="Enter Destination Wallet Address">
            </div>
            <div class="mt-4">
                <label class="block mb-2 text-sm font-bold text-gray-700" for="tokenSelect">Select Token:</label>
                <select 
                bind:value={symbol}
                class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="tokenSelect">
                    <!-- Token options will be dynamically populated here -->
                    {#if userBalances.length == 0}
                        <option value="none">No Tokens Available</option>
                    {:else}
                        <option value="" selected>Select a token...</option>

                        {#each userBalances as balance}
                            <option value={balance.symbol}>{balance.symbol}</option>
                        {/each}
                    {/if}
                </select>
            </div>
            <div class="mt-4">
                <label class="block mb-2 text-sm font-bold text-gray-700" for="amountToSend">Amount:</label>
                <input 
                bind:value={amount}
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="amountToSend" type="number" min="0" placeholder="Amount to Send">
            </div>
            <div class="mt-4">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                on:click={sendTokens}
                type="button">Send Tokens</button>
            </div>

            <div class="items-center px-4 py-3">
                <button on:click={closeModal} class="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300">
                  Cancel
                </button>
              </div>
        </div>
    </div>
</div>