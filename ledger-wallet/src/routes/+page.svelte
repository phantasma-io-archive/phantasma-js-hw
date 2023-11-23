<script lang="ts">
    import TokenList from "$lib/TokenList.svelte";
    import NFTList from "$lib/NFTList.svelte";
	import TransactionsList from "$lib/TransactionsList.svelte";
	import SendTokens from "$lib/SendTokens.svelte";
	import WalletInformation from "$lib/WalletInformation.svelte";
    import {WalletAddress, IsWalletConnected, PhantasmaRPC, NetworkSelected, ExplorerURL} from "$lib/store";
	import WalletConnection from "$lib/WalletConnection.svelte";
	import { onMount } from "svelte";
	import type { Account, PhantasmaAPI } from "phantasma-ts";
	import Staking from "$lib/Staking.svelte";

    NetworkSelected.subscribe(value => {
        if (value == "mainnet")
        {
            ExplorerURL.set("https://explorer.phantasma.io/");
        }
        else
        {
            ExplorerURL.set("https://test-explorer.phantasma.io/");
        }
    });

    let walletAddress = "asdasd";
    let isLedgerSupported = false;
    IsWalletConnected.set(false);
</script>

<WalletConnection />

{#if $IsWalletConnected}

    <WalletInformation />

    <TokenList />

    <Staking />

    <NFTList />

    <TransactionsList />

    <SendTokens />

{/if}