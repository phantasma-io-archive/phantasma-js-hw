<script lang="ts">
	import { onMount } from "svelte";
    import "../input.css";
	import { PhantasmaRPC, MyConfig, MyConfigWritable, NetworkSelected, IsWalletConnected} from "$lib/store";
	import { ScriptBuilder, PhantasmaAPI} from "phantasma-ts";
    let isLedgerSupported = false;
    let GlobalTransportWebUSB;
    let phantasmaJSHW;
    let phantasmaAPI;
    let globalWindow;
    let network : string = 'mainnet';

    PhantasmaRPC.subscribe((value) => {
        phantasmaAPI = value;
    });

    function required(modname){
        /* eslint-disable */
        if (typeof BigInt === 'undefined') {
            return;
        }
        const module = requireRaw(modname);
        if (module) {
            return module;
        } else {
            throw Error(`undefined module:'${modname}'`);
        }
    };
    const requireRaw = (modname) => {
        throw Error(`unknown module:'${modname}'`);
    };

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
        MyConfig.transport = window.TransportWebUSB;
        MyConfig.blockchainExplorer = 'https://explorer.phantasma.io/';
        MyConfig.debug = true;
        MyConfig.transport = window.TransportWebUSB;
        MyConfig.rpc = phantasmaAPI;
        MyConfig.bip32Factory = window.bip32Factory;
        MyConfig.bip39 = window.bip39;
        MyConfig.curve = window.tinySecp256k1;
        MyConfig.nexusName = 'mainnet';
        MyConfig.chainName = 'main';
        MyConfig.tokenNames = ['KCAL', 'SOUL'];
        MyConfig.gasPrice = 100000;
        MyConfig.gasLimit = 900;
        MyConfig.verifyResponse = false;
        MyConfigWritable.set(MyConfig);
        window.phantasmaJsHwConfig = MyConfig;
    }

    function ConfigTestnet(){
        console.log('ConfigTestnet');
        PhantasmaRPC.set(new PhantasmaAPI("https://testnet.phantasma.io/rpc", undefined, "testnet"));
        MyConfig.transport = window.TransportWebUSB;
        MyConfig.blockchainExplorer = 'https://test-explorer.phantasma.io/';
        MyConfig.debug = true;
        MyConfig.transport = window.TransportWebUSB;
        MyConfig.rpc = phantasmaAPI;
        MyConfig.bip32Factory = window.bip32Factory;
        MyConfig.bip39 = window.bip39;
        MyConfig.curve = window.tinySecp256k1;
        MyConfig.scriptBuilder = new ScriptBuilder();
        MyConfig.nexusName = 'testnet';
        MyConfig.chainName = 'main';
        MyConfig.tokenNames = ['KCAL', 'SOUL'];
        MyConfig.gasPrice = 100000;
        MyConfig.gasLimit = 900;
        MyConfig.verifyResponse = false;
        MyConfigWritable.set(MyConfig);
        window.phantasmaJsHwConfig = MyConfig;
    }

    onMount(async () => {
        globalWindow = window;
        if (!window.phantasmaJsHw) {
            window.phantasmaJsHw = {};
        }

        GlobalTransportWebUSB = (await import("../../../dist/TransportWebUSB.js")).default;
        //window.TransportWebUSB = GlobalTransportWebUSB;

        phantasmaJSHW = (await import("../../../dist/phantasma-js-hw")).default;
        //window.phantasmaJsHw = phantasmaJSHW;

        (await import("$lib/phantasma-js-hw-web.js")).default;


        if (network == 'mainnet'){
            ConfigMainnet();
        }else if (network == 'testnet'){
            ConfigTestnet();
        }


        await OnLoadApplication();
    });

    async function OnLoadApplication(){
        const isSupportedFlag = await window.TransportWebUSB.isSupported();
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
                <div id="unsupportedLedger" class="hidden text-red-500">Ledger not supported, check that site is https.</div>
            {:else}
                 <slot />
            {/if}
        </div>
    </div>
</div>