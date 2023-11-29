<script lang="ts">
    import { ACCOUNT_INDEX, IsWalletConnected, LedgerInUse, MyConfigWritable, NetworkSelected, WaleltPublicKey, WalletAddress } from "$lib/store";
	import { FetchUser } from "$lib/Commands";
	import { Address, GetLedgerAccountSigner, type LedgerConfig } from "phantasma-ts";
	import { NotificationSuccess, NotificationWarning } from "$lib/NotificationsBuilder";
    let network : string = 'mainnet';

    let myConfig : LedgerConfig;
    MyConfigWritable.subscribe((value) => {
        myConfig = value;
    });

    NetworkSelected.subscribe((value) => {
        network = value;
    });

    async function checkLedger(){
        try {
            await checkLedgerOrError();
        } catch (error) {
            console.trace(error);
        }
    }

    async function checkLedgerOrError() {
        const TransportWebUSB = myConfig.Transport;
        const isSupportedFlag = await TransportWebUSB.isSupported();
        console.log('connectLedger', 'isSupportedFlag', isSupportedFlag);

        if (isSupportedFlag) {
            let result = await TransportWebUSB.create();
            if ( !result ){
                return;
            }

            let accountSigner = await GetLedgerAccountSigner(myConfig, ACCOUNT_INDEX);
            if ( accountSigner.GetAccount() == Address.Null){
                NotificationWarning("Ledger not connected", "Please open the Phantasma App.");
                IsWalletConnected.set(false);
                return;
            }
            
            NotificationSuccess("Ledger connected", "Ledger connected successfully.");
            WalletAddress.set(accountSigner.GetAccount().Text);
            WaleltPublicKey.set(accountSigner.GetPublicKey());
            IsWalletConnected.set(true);
        }else {
            IsWalletConnected.set(false);
        }
    }

    function onNetworkChanged(){
        console.log('onNetworkChanged', network);
        NetworkSelected.set(network);
    }
</script>

<div id="checkLedger text-center">
    <h2 class="text-xl text-center my-4">Connect to Ledger</h2>
    <hr class="my-4 bg-slate-700">
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={checkLedger}>Connect to Ledger Wallet</button>
    <!-- Select option mainnet and testnet -->
    <div class="flex flex-col items-center justify-center">
        <div class="flex flex-row items-center justify-center">
            <label for="selNet" class="text-xl text-center my-4">Select Network</label>
            <select id="selNet"
            bind:value={network}
            on:change={onNetworkChanged}
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <option value="mainnet">Mainnet</option>
                <option value="testnet">Testnet</option>
            </select>
        </div>
    </div>
</div>