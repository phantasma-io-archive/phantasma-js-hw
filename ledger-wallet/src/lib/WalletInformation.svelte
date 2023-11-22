<script lang="ts">
    import {WalletAddress, IsWalletConnected} from "$lib/store";
    let walletAddress = "";

    WalletAddress.subscribe(value => {
        walletAddress = value;
    });
</script>
<!-- Wallet Information Section -->
<div class="my-6 bg-white p-4 shadow rounded w-1/2">
    <h2 class="text-xl font-semibold mb-3">Wallet Information</h2>
    <p><strong>Address:</strong> <span id="walletAddress">{walletAddress}</span></p>
</div>