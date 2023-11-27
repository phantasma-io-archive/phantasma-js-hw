<script lang="ts">
    import {StakeSOUL, UnStakeSOUL} from "$lib/Commands";
    export let openStakingModal = true;
    export let closeModal = () => {
        openStakingModal = false;
    }
    let stakeAmount = 0;

    let confirmStake = async () => {
        openStakingModal = false;
        await StakeSOUL(stakeAmount * 10 ** 8);
    }

    let confirmUnstake = async () => {
        openStakingModal = false;
        await UnStakeSOUL(stakeAmount * 10 ** 8);
    }
</script>
<!-- Modal for Staking More SOUL -->
<div aria-hidden="true" id="stakingModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" on:click={closeModal}>
    <div aria-hidden="true" class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" on:click|stopPropagation>
      <div class="mt-3 text-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Stake SOUL</h3>
        <div class="mt-2 px-7 py-3">
          <input type="number" 
          bind:value={stakeAmount}
          id="stakeAmount" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Amount of SOUL">
        </div>
        <div class="items-center px-4 py-3">
          <button id="confirmStake" on:click={confirmStake} class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300">
            Stake
          </button>
        </div>
        <div class="items-center px-4 py-3">
          <button id="confirmUnstake" on:click={confirmUnstake} class="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
            Unstake
          </button>
        </div>
        <div class="items-center px-4 py-3">
          <button on:click={closeModal} class="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>