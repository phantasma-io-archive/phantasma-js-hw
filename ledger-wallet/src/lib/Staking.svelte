<script lang="ts">
    import {PhantasmaRPC , WalletAddress, UserData, TransactionList} from "$lib/store";
    import type { PhantasmaAPI, Balance, Account, Paginated, AccountTransactions, TransactionData} from "phantasma-ts";
    import StakingModal from "$lib/StakingModal.svelte";
    let stakedSOULAmount = "0";
    let unclaimedKCALAmount = "0";
    let userData : Account;
    let transactionList: TransactionData[];
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
        stakedSOULAmount = userData.stakes.amount;
        unclaimedKCALAmount = userData.stakes.unclaimed;
    } 

    async function LoadStakingHistory(){
        transactionList = accountTransactions.result.txs;
        for ( let item in transactionList ){
            
        }
    }
    
    let openStakingModal = false;
    function openModal(){
        openStakingModal = true;
    }
</script>

<!-- Staked SOUL and Unclaimed KCAL Section -->
<div class="my-6 bg-white p-4 shadow rounded">
    <h2 class="text-xl font-semibold mb-3">Staking Details</h2>

    <div class="mb-4">
        <span class="text-lg">Currently Staked SOUL: </span>
        <span id="stakedSoulAmount" class="text-lg font-semibold">{stakedSOULAmount}</span> SOUL
    </div>

    <div>
        <span class="text-lg">Unclaimed KCAL: </span>
        <span id="unclaimedKcalAmount" class="text-lg font-semibold">{unclaimedKCALAmount}</span> KCAL
        <!-- Optionally, add a button to claim KCAL here -->
    </div>

    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" on:click={openModal}>Stake More</button>
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
