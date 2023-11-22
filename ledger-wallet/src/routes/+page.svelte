<script lang="ts">
    import TokenList from "$lib/TokenList.svelte";
    import NFTList from "$lib/NFTList.svelte";
	import TransactionsList from "$lib/TransactionsList.svelte";
	import SendTokens from "$lib/SendTokens.svelte";
	import WalletInformation from "$lib/WalletInformation.svelte";
    import {WalletAddress, IsWalletConnected, PhantasmaRPC} from "$lib/store";
	import WalletConnection from "$lib/WalletConnection.svelte";
	import { onMount } from "svelte";
	import type { Account, PhantasmaAPI } from "phantasma-ts";
    let walletAddress = "asdasd";
    let isLedgerSupported = false;
</script>

<WalletConnection />

{#if $IsWalletConnected}

    <WalletInformation />

    <TokenList />

    <NFTList />

    <TransactionsList />

    <SendTokens />

{/if}