<script lang="ts">
    import {PhantasmaRPC , WalletAddress} from "$lib/store";
    import type { PhantasmaAPI, Balance} from "phantasma-ts";
	import { onMount } from "svelte";
    let phantasmaAPI : PhantasmaAPI;
    PhantasmaRPC.subscribe(async (value) => {
        phantasmaAPI = value;
        await LoadUserData();
    });

    let walletAddress = "";
    let userBalances : Balance[] = []; 
    WalletAddress.subscribe( async value => {
        walletAddress = value;
        await LoadUserData();
    });

    async function LoadUserData(){
        console.log(walletAddress);
        let accountDetails = await phantasmaAPI.getAccount(walletAddress);
        userBalances = accountDetails.balances;
    }

    onMount(async () => {
        walletAddress = $WalletAddress;
        await LoadUserData();
    });
</script>
<!-- Token List Section -->
<div class="my-6 w-1/2">
    <h2 class="text-xl font-semibold mb-3">Your Tokens</h2>
    <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
        <thead class="bg-gray-800 text-white">
            <tr>
                <th class="w-1/3 px-4 py-2">Token Name</th>
                <th class="w-1/3 px-4 py-2">Balance</th>
                <th class="w-1/3 px-4 py-2">Actions</th>
            </tr>
        </thead>
        <tbody id="tokenList" class="text-gray-700">
            {#each userBalances as balance}
                <tr>
                    <td>{balance.symbol}</td>
                    <td>{Number(balance.amount) / 10 ** balance.decimals}</td>
                    <td>Nothing</td>
                </tr>
            {/each}
            <!-- Token items will be added here dynamically -->
        </tbody>
        </table>
    </div>
</div>