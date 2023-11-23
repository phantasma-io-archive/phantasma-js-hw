<script lang="ts">
    import {PhantasmaRPC, UserData } from '$lib/store';
	import type { Account, Balance, NFT } from 'phantasma-ts';
	import { GetUserNFTS } from '$lib/Commands';
    import NFTItem from '$lib/NFTItem.svelte';
    
    let nfts : NFT[] = [];
    let userData : Account;
    let nftName = "", nftDescription = "", nftImageURL = "";

    UserData.subscribe( async value => {
        userData = value;
        await LoadNFTs();
    });

    async function LoadNFTs() {
        let balance : Balance;
        nfts = [];
        if ( userData == null || userData == undefined )
        {
            return;
        }

        if ( userData.balances.length == 0 )
        {
            return;
        }

        userData.balances.forEach( async balance => {
            if ( balance.ids != null && balance.ids != undefined && balance.ids.length > 0 )
            {
                await GetUserNFTS(balance.symbol, balance.ids).then( result => {
                    if ( result != null || result != undefined )
                    {
                        nfts = nfts.concat(result);
                    }
                });
            }
        });

        let nft : NFT;
        //nft.properties.findLast(k => k.Key == "Name")?.Value;
    }
</script>

<!-- NFTs Owned Section -->
<div class="my-6 bg-white p-4 shadow rounded">
    <h2 class="text-xl font-semibold mb-3">Your NFTs</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each nfts as nft}
            <NFTItem nft={nft} />
        {/each}
    </div>
</div>