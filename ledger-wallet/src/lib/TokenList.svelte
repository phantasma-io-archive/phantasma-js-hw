<script lang="ts">
    import {PhantasmaRPC , WalletAddress, UserData} from "$lib/store";
    import type { PhantasmaAPI, Balance, Account} from "phantasma-ts";
	import { onMount } from "svelte";

    let userData : Account;
    let userBalances : Balance[] = []; 
    UserData.subscribe(value => {
        userData = value;
        LoadUserData();
    });

    let walletAddress = "";
    WalletAddress.subscribe(value => {
        walletAddress = value;
    });

    async function LoadUserData(){
        userBalances = userData.balances;
    }
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
            </tr>
        </thead>
        <tbody id="tokenList" class="text-gray-700">
            {#each userBalances as balance}
                <tr>
                    <td class="w-1/3 px-4 py-2">{balance.symbol}</td>
                    <td class="w-1/3 px-4 py-2">{Number(balance.amount) / 10 ** balance.decimals}</td>
                </tr>
            {/each}
        </tbody>
        </table>
    </div>
</div>