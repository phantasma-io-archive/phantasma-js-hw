<script lang="ts">
    import {PhantasmaRPC , WalletAddress, UserData, TransactionList} from "$lib/store";
    import type { PhantasmaAPI, Balance, Account, Paginated, AccountTransactions, TransactionData} from "phantasma-ts";
    import StakingModal from "$lib/StakingModal.svelte";
	import { ClaimKCAL } from "./Commands";
    let stakedSOULAmount : Number = 0;
    let unclaimedKCALAmount : Number = 0;
    let userData : Account;
    let transactionList: TransactionData[];
    let stackingHistoryList: TransactionData[];
    let accountTransactions: Paginated<AccountTransactions>;
    
    TransactionList.subscribe( async value => {
        accountTransactions = value;
        await LoadStakingHistory();
    });

    UserData.subscribe(async value => {
        userData = value;
        await LoadUserData();
    });

    async function LoadUserData(){
        if ( userData == null || userData == undefined )
            return;
        if ( userData.stakes == null || userData.stakes == undefined )
        {
            stakedSOULAmount = 0;
            unclaimedKCALAmount = 0;
            return;
        }

        stakedSOULAmount = Number(userData.stakes.amount)/10 ** 8;
        unclaimedKCALAmount = Number(userData.stakes.unclaimed) / 10 ** 10;
    } 

    async function LoadStakingHistory(){
        if ( accountTransactions == null || accountTransactions == undefined )
            return;
        transactionList = accountTransactions.result.txs;
        /*for ( let item in transactionList ){

        }*/
    }
    
    let openStakingModal = false;
    function openModal(){
        openStakingModal = true;
    }

    async function Claim(){
        await ClaimKCAL();
    }
</script>

<!-- Staked SOUL and Unclaimed KCAL Section -->
<div class="my-6 bg-white p-4 shadow rounded">
    <h2 class="text-xl font-semibold mb-3">Staking Details</h2>

    <div class="mb-4">
        <span class="text-lg">Currently Staked: </span>
        <span id="stakedSoulAmount" class="text-lg font-semibold">{stakedSOULAmount.toFixed(2)}</span> <b>SOUL</b>
    </div>

    <div>
        <span class="text-lg">Unclaimed: </span>
        <span id="unclaimedKcalAmount" class="text-lg font-semibold">{unclaimedKCALAmount.toFixed(2)}</span> <b>KCAL</b>
        <!-- Optionally, add a button to claim KCAL here -->
    </div>

    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" on:click={openModal}>Stake More</button>
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" on:click={Claim}>Claim</button>
</div>

<!-- Staking History Section -->
<div class="my-6 bg-white p-4 shadow rounded">
    <h2 class="text-xl font-semibold mb-3">Staking History</h2>
    <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
        <thead class="bg-gray-800 text-white">
            <tr>
            <th class="px-4 py-2">Date</th>
            <th class="px-4 py-2">Amount</th>
            <th class="px-4 py-2">Transaction Type</th>
            </tr>
        </thead>
        <tbody id="stakingHistoryList" class="text-gray-700">
            <!-- Staking history items will be dynamically added here -->
        </tbody>
        </table>
    </div>
</div>

{#if openStakingModal}
    <StakingModal bind:openStakingModal />
{/if}
