
<script lang="ts">
	import { TransactionList } from "$lib/store";
	import { Timestamp, type AccountTransactions, type Paginated, type TransactionData, getTokenEventData } from "phantasma-ts";
    let transactionList: Array<TransactionData> = [];
    let stackingHistoryList: Array<{time:Timestamp, amount:string, transactionType:string}> = [];
    let accountTransactions: Paginated<AccountTransactions>;
    
        
    TransactionList.subscribe( async value => {
        accountTransactions = value;
        await LoadStakingHistory();

    });
    async function LoadStakingHistory(){
        if ( accountTransactions == null || accountTransactions == undefined )
            return;

        console.log("Loading Staking History");
        transactionList = accountTransactions.result.txs;
        for ( let item in transactionList ){
            for (let i = 0; i < transactionList[item].events.length; i++){
                if ( transactionList[item].events[i].kind == "TokenStake" || transactionList[item].events[i].kind == "TokenUnstake" ){
                    let decodeEvent = getTokenEventData(transactionList[item].events[i].data);
                    if ( decodeEvent.symbol != "SOUL" )
                        continue;

                    if (stackingHistoryList.length > 0 && stackingHistoryList[stackingHistoryList.length - 1].time.value == new Timestamp(transactionList[item].timestamp).value){
                        console.log("Duplicate");
                        continue;
                    }

                    stackingHistoryList.push({
                        time: new Timestamp(transactionList[item].timestamp), 
                        amount: String(decodeEvent.value / 10 ** 8), 
                        transactionType: transactionList[item].events[i].kind 
                    });
                }
            }
        }
    }
</script>
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
            {#if stackingHistoryList.length == 0}
                <tr>
                    <td class="border px-4 py-2 text-center" colspan="3">No Staking History</td>
                </tr>
            {:else}
                {#each stackingHistoryList as item}
                    <tr>
                        <td class="border px-4 py-2 text-center">{item.time}</td>
                        <td class="border px-4 py-2 text-center">{item.amount}</td>
                        <td class="border px-4 py-2 text-center">{item.transactionType}</td>
                    </tr>
                {/each}
            {/if}
            <!-- Staking history items will be dynamically added here -->
        </tbody>
        </table>
    </div>
</div>