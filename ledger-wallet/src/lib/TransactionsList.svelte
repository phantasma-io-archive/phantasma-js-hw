<script lang="ts">
    import {PhantasmaRPC , WalletAddress} from "$lib/store";
    import type { PhantasmaAPI } from "phantasma-ts";
	import { onMount } from "svelte";
    let phantasmaAPI : PhantasmaAPI;
    PhantasmaRPC.subscribe(async (value) => {
        phantasmaAPI = value;
        await LoadUserData();
    });

    let walletAddress = "";
    let transactionList : string[] = []; 
    WalletAddress.subscribe(value => {
        walletAddress = value;
    });

    async function LoadUserData(){
        let accountDetails = await phantasmaAPI.getAccount(walletAddress);
        transactionList = accountDetails.txs;
    }

    onMount(async () => {
        await LoadUserData();
    });

</script>
<!-- Transactions List Section -->
<div class="my-6 bg-white p-4 shadow rounded">
    <h2 class="text-xl font-semibold mb-3">Transaction History</h2>
    <div class="overflow-x-auto">
    <table class="min-w-full bg-white">
        <thead class="bg-gray-800 text-white">
        <tr>
            <th class="px-4 py-2">Transaction ID</th>
            <th class="px-4 py-2">Date</th>
            <th class="px-4 py-2">Amount</th>
            <th class="px-4 py-2">Status</th>
        </tr>
        </thead>
        <tbody id="transactionList" class="text-gray-700">
            {#each transactionList as tx}
                <tr>
                    <td>{tx}</td>
                </tr>
            {/each}
        <!-- Transaction items will be dynamically added here -->
        </tbody>
    </table>
    </div>
</div>