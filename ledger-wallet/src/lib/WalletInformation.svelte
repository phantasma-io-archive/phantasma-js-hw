<script lang="ts">
    import {WalletAddress, IsWalletConnected, ExplorerURL} from "$lib/store";
    let explorerURL = "";
    let walletAddress = "";

    /*ExplorerURL.subscribe(value => {
        explorerURL = value+"en/address?id=";
    });*/

    WalletAddress.subscribe(value => {
        walletAddress = value;
    });
</script>
<!-- Wallet Information Section -->
<div class="my-6 text-center bg-white p-4 shadow rounded w-1/2">
    <h2 class="text-xl font-semibold mb-3">Wallet Information</h2>
    <p><strong>Address</strong></p>
    <a href="{explorerURL}{walletAddress}" class="text-blue-400 hover:text-blue-600">{walletAddress}</a>
    <p></p>
</div>