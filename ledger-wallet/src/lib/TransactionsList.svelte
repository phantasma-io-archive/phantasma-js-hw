<script lang="ts">
    import {PhantasmaRPC , WalletAddress} from "$lib/store";
    import type { AccountTransactions, PhantasmaAPI, TransactionData } from "phantasma-ts";
	import { onMount } from "svelte";
	import { FetchUserTransactions } from "$lib/Commands";
    let pageNumber = 1;
    let pageSize = 50;
    let transactionList : TransactionData[] = []; 

    let phantasmaAPI : PhantasmaAPI;
    PhantasmaRPC.subscribe(async (value) => {
        phantasmaAPI = value;
        await LoadUserData();
    });

    let walletAddress = "";
    WalletAddress.subscribe(value => {
        walletAddress = value;
    });

    async function LoadUserData(){
        transactionList = (await FetchUserTransactions(pageNumber, pageSize)).result.txs;
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
            <th class="px-4 py-2">Transaction Hash</th>
            <th class="px-4 py-2">Date</th>
            <th class="px-4 py-2">Status</th>
        </tr>
        </thead>
        <tbody id="transactionList" class="text-gray-700">
            {#each transactionList as tx}
                <tr>
                    <td>{tx.hash}</td>
                    <td>{tx.timestamp}</td>
                    <td>{tx.state}</td>
                </tr>
            {/each}
        </tbody>
    </table>
    </div>
</div>