<script lang="ts">
    import {PhantasmaRPC , WalletAddress, UserData, TransactionList} from "$lib/store";
    import type { PhantasmaAPI, Balance, Account, Paginated, AccountTransactions, TransactionData} from "phantasma-ts";
    import StakingModal from "$lib/Staking/StakingModal.svelte";
	import { ClaimKCAL, FetchUser, GetTransactionResult, Timeout } from "$lib/Commands";
	import { NotificationError, NotificationSuccess, NotificationWarning } from "$lib/NotificationsBuilder";
    let stakedSOULAmount : Number = 0;
    let unclaimedKCALAmount : Number = 0;
    let userData : Account;
    

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
    
    let openStakingModal = false;
    function openModal(){
        openStakingModal = true;
    }

    async function Claim(){
        NotificationWarning("Claiming KCAL", `Please check your wallet to confirm the transaction.`);
        let result = await ClaimKCAL();
        if ( result == null || result == undefined )
            return;
        if ( result.success ){
            NotificationWarning("Fetching Transaction", `Please wait while we fetch the transaction.`);
            await Timeout(5 * 1000); // Wait 5 seconds for the transaction to be processed
            let transaction = await GetTransactionResult(result.message);
            if (transaction?.state == "Halt")
            {
                NotificationSuccess("Claim Successful", `Successfully claimed ${unclaimedKCALAmount} KCAL`);
                await FetchUser();
            }else {
                NotificationError("Claim Failed", `Failed to claim ${unclaimedKCALAmount} KCAL`);
            }
        }else {
            NotificationError("Transaction Canceled", `Transaction canceled to claim ${unclaimedKCALAmount} KCAL`);
        }

    }
</script>

<!-- Staked SOUL and Unclaimed KCAL Section -->
<div class="my-6 bg-white p-4 shadow rounded text-center">
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



{#if openStakingModal}
    <StakingModal bind:openStakingModal />
{/if}
