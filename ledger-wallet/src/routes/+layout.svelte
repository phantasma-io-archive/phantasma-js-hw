<script lang="ts">
    import "../input.css";
	import { onMount } from "svelte";
    import { Buffer } from "buffer";
    window.Buffer = Buffer;

	import { PhantasmaRPC, MyConfig, MyConfigWritable, NetworkSelected, IsWalletConnected} from "$lib/store";
	import { ScriptBuilder, PhantasmaAPI} from "phantasma-ts";
    import {BIP32Factory} from "bip32";
    import bip39 from "bip39";
    import * as tinySecp256k1 from "tiny-secp256k1";
    import type TransportWebUSB from "@ledgerhq/hw-transport-webusb";

    let globalWindow = undefined;
    let isLedgerSupported = false;
    let globalTransportWebUSB : TransportWebUSB | undefined = undefined;
    let phantasmaJSHW;
    let phantasmaAPI : PhantasmaAPI;
    let network : string = 'mainnet';

    PhantasmaRPC.subscribe((value) => {
        phantasmaAPI = value;
    });

    NetworkSelected.subscribe(async (value) => {
        network = value;
        if ( globalWindow == undefined){
            return;
        }

        if (network == 'mainnet'){
            ConfigMainnet();
        }else if (network == 'testnet'){
            ConfigTestnet();
        }
    });

    function ConfigMainnet(){
        console.log('ConfigMainnet')
        PhantasmaRPC.set(new PhantasmaAPI("https://pharpc1.phantasma.io/rpc", undefined, "mainnet"));
        MyConfig.Debug = true;
        MyConfig.Transport = globalTransportWebUSB;
        MyConfig.RPC = phantasmaAPI;
        MyConfig.Bip32Factory = BIP32Factory;
        MyConfig.Bip39 = bip39;
        MyConfig.Curve = tinySecp256k1;
        MyConfig.NexusName = 'mainnet';
        MyConfig.ChainName = 'main';
        MyConfig.TokenNames = ['KCAL', 'SOUL'];
        MyConfig.GasPrice = 100000;
        MyConfig.GasLimit = 900;
        MyConfig.VerifyResponse = false;
        MyConfigWritable.set(MyConfig);
    }

    function ConfigTestnet(){
        console.log('ConfigTestnet');
        PhantasmaRPC.set(new PhantasmaAPI("https://testnet.phantasma.io/rpc", undefined, "testnet"));
        MyConfig.Debug = true;
        MyConfig.Transport = globalTransportWebUSB;
        MyConfig.RPC = phantasmaAPI;
        MyConfig.Bip32Factory = BIP32Factory;
        MyConfig.Bip39 = bip39;
        MyConfig.Curve = tinySecp256k1;
        MyConfig.NexusName = 'testnet';
        MyConfig.ChainName = 'main';
        MyConfig.TokenNames = ['KCAL', 'SOUL'];
        MyConfig.GasPrice = 100000;
        MyConfig.GasLimit = 900;
        MyConfig.VerifyResponse = false;
        MyConfigWritable.set(MyConfig);
    }

    onMount(async () => {
        globalWindow = window;
        
        globalTransportWebUSB = (await import("@ledgerhq/hw-transport-webusb")).default;

        //GlobalTransportWebUSB = (await import("../../../dist/TransportWebUSB.js")).default;
        //window.TransportWebUSB = GlobalTransportWebUSB;

        if (network == 'mainnet'){
            ConfigMainnet();
        }else if (network == 'testnet'){
            ConfigTestnet();
        }


        await OnLoadApplication();
    });

    async function OnLoadApplication(){
        const isSupportedFlag = await globalTransportWebUSB!.isSupported();
        if (isSupportedFlag) {
            isLedgerSupported = true;
        } else {
            isLedgerSupported = false;
        }
    }

    async function CheckHttpsProtocol(){
        if (window.location.protocol !== "https:") {
            //document.getElementById("unsupportedLedger").style.display = "block";
            //document.getElementById("checkLedger").style.display = "none";
        }
    
    }

</script>

<div class="w-full bg-slate-200">
    <div class="container-fluid mx-auto px-4">
        <h1 class="text-2xl font-bold text-center py-4">Phantasma Wallet</h1>

        <div class="flex flex-col items-center justify-center">
            {#if !isLedgerSupported}
                <div id="unsupportedLedger" class="text-red-500">Ledger not supported, check that site is https.</div>
            {:else}
                 <slot />
            {/if}
        </div>
    </div>
</div>