<script lang="ts">
    import {PhantasmaRPC, WalletAddress, UserData} from "$lib/store";
	import { type Account, type Balance, PhantasmaAPI, Address, SendTransactionLedger, type LedgerConfig } from "phantasma-ts";
	import { onMount } from "svelte";

    /// 	import { toasts, ToastContainer, FlatToast }  from "svelte-toasts";
    export let isModalOpen = true;
    let phantasmaAPI : PhantasmaAPI;
    let walletAddress = "";
    let destinationAddress = "";
    let amount = 0;
    let userBalances : Array<Balance> = []; 
    let userData : Account;
    let isInputValid = false;
    let isAddressValid = false;

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

    function sendTokens(){
        //response = await window.phantasmaJsHw.sendAmountUsingLedger(config, withdrawAmount, tokenName, withdrawAccount);

        if ( !isAddressValid && !isInputValid )
            return;

       //response = await SendTransactionLedger(phantasmaAPI, walletAddress, destinationAddress, amount, "KCAL");
        
    }

    function closeModal(){
        isModalOpen = false;
    }

</script>
<!-- Send Tokens Section -->
<div aria-hidden="true" id="stakingModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" on:click={closeModal} on:keypress={closeModal}>
    <div aria-hidden="true" class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" on:click|stopPropagation on:keypress|stopPropagation>
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
                <select class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="tokenSelect">
                    <!-- Token options will be dynamically populated here -->
                    {#if userBalances.length == 0}
                        <option value="none">No Tokens Available</option>
                    {:else}
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