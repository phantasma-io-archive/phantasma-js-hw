<script lang="ts">
    import {PhantasmaRPC, WalletAddress} from "$lib/store";
	import type { Balance, PhantasmaAPI } from "phantasma-ts";
	import { onMount } from "svelte";

    /// 	import { toasts, ToastContainer, FlatToast }  from "svelte-toasts";

    let phantasmaAPI : PhantasmaAPI;
    PhantasmaRPC.subscribe((value) => {
        phantasmaAPI = value;
    });

    let destinationAddress = "";
    let amount = 0;

    let walletAddress = "";
    WalletAddress.subscribe(value => {
        walletAddress = value;
    });

    let userBalances : Balance[] = []; 
    async function LoadUserData(){
        let accountDetails = await phantasmaAPI.getAccount(walletAddress);
        userBalances = accountDetails.balances;
    }

    onMount(async () => {
        await LoadUserData();
    });
    

    function sendTokens(){
        //response = await window.phantasmaJsHw.sendAmountUsingLedger(config, withdrawAmount, tokenName, withdrawAccount);

    }

</script>
<!-- Send Tokens Section -->
<div class="my-6 bg-white p-4 shadow rounded w-1/2">
    <h2 class="text-xl font-semibold mb-3">Send Tokens</h2>
    <div>
        <label class="block mb-2 text-sm font-bold text-gray-700" for="destinationAddress">Destination Address:</label>
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="destinationAddress" type="text" placeholder="Enter Destination Wallet Address">
    </div>
    <div class="mt-4">
        <label class="block mb-2 text-sm font-bold text-gray-700" for="tokenSelect">Select Token:</label>
        <select class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="tokenSelect">
            <!-- Token options will be dynamically populated here -->
            {#each userBalances as balance}
                <option value={balance.symbol}>{balance.symbol}</option>
            {/each}
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
</div>