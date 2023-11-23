<script lang="ts">
	import type { NFT } from "phantasma-ts";

    export let nft : NFT;

    let nftName = nft.properties.find(k => k.key == "Name")?.value;
    let nftDescription = nft.properties.find(k => k.key == "Description")?.value;
    let nftImageURL = nft.properties.find(k => k.key == "ImageURL")?.value;
    let isVideo = false;
    if ( nftImageURL != null || nftImageURL != undefined )
    {
        if ( nftImageURL.includes(".mp4") || nftImageURL.includes(".webm") || nftImageURL.includes(".ogg") || nftImageURL.includes(".mov") ||
        nftImageURL.includes(".avi") || nftImageURL.includes(".wmv") || nftImageURL.includes(".flv") || nftImageURL.includes(".mkv") || 
        nftImageURL.includes(".m4v") || nftImageURL.includes(".mpg") || nftImageURL.includes(".mpeg") || nftImageURL.includes(".3gp") || 
        nftImageURL.includes("crown.png") )
        {
            isVideo = true;
        }

        if ( nftImageURL.includes("ipfs") )
        {
            nftImageURL = "https://ipfs.io/ipfs/" + nftImageURL.replace("ipfs://", "");
        }
    }
</script>

<div class="w-40">
    {#if nftImageURL != null}
        {#if isVideo}
            <video autoplay loop muted class="rounded shadow h-32 w-32">
                <source  src="{nftImageURL}" type="video/mp4">
                {nftName}
            </video>
        {:else}
            <img src="{nftImageURL}" alt="{nftName}" class="rounded shadow h-32 w-32" />
        {/if}
    {:else}
        <img  alt="not found" class="rounded shadow h-32 w-32" />
    {/if}
    <div class="text-center">
        <h3 class="text-lg font-semibold w-32 text-ellipsis truncate">{nft.id}</h3>
        <h3 class="text-lg font-semibold">{nftName}</h3>
        <p class="text-sm text-gray-500 truncate">{nftDescription}</p>
    </div>
</div>