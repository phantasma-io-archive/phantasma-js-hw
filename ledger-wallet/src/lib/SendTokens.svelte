<script lang="ts">
	import SendTokensModal from "./SendTokensModal.svelte";

    let isModalOpen = false;
    let openModal = () => {
        isModalOpen = true;
    }
</script>

<!-- Staked SOUL and Unclaimed KCAL Section -->
<div class="my-6 bg-white p-4 shadow rounded">
    <h2 class="text-xl font-semibold mb-3">Send Tokens</h2>

    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" on:click={openModal}>Send Tokens</button>
</div>

{#if isModalOpen}
    <SendTokensModal bind:isModalOpen/>
{/if}