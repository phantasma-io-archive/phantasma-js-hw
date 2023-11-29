<script lang="ts">
    import TokenList from "$lib/Tokens/TokenList.svelte";
    import NFTList from "$lib/NFTs/NFTList.svelte";
	import TransactionsList from "$lib/Transactions/TransactionsList.svelte";
	import SendTokens from "$lib/Tokens/SendTokens.svelte";
	import WalletInformation from "$lib/WalletConnection/WalletInformation.svelte";
    import {WalletAddress, IsWalletConnected, PhantasmaRPC, NetworkSelected, ExplorerURL} from "$lib/store";
	import WalletConnection from "$lib/WalletConnection/WalletConnection.svelte";
	import { onMount } from "svelte";
	import type { Account, PhantasmaAPI } from "phantasma-ts";
	import Staking from "$lib/Staking/Staking.svelte";
	import StakingHistory from "$lib/Staking/StakingHistory.svelte";

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

    <div class=" grid grid-cols-2 space-x-4">
        <SendTokens />

        <Staking />
    </div>

    <StakingHistory />

    <NFTList />

    <TransactionsList />
{/if}