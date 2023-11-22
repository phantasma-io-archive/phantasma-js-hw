<script lang="ts">
    import { ACCOUNT_INDEX, IsWalletConnected, LedgerInUse, NetworkSelected, WaleltPublicKey, WalletAddress } from "$lib/store";
    let network : string = 'mainnet';

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
        const TransportWebUSB = window.TransportWebUSB;
        const isSupportedFlag = await TransportWebUSB.isSupported();
        console.log('connectLedger', 'isSupportedFlag', isSupportedFlag);

        if (isSupportedFlag) {
            await window.TransportWebUSB.create();
            let accountSigner = await window.phantasmaJsHw.getLedgerAccountSigner(
                ACCOUNT_INDEX
            );

            WalletAddress.set(accountSigner.getAccount());
            WaleltPublicKey.set(accountSigner.getPublicKey());
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
            <label class="text-xl text-center my-4">Select Network</label>
            <select 
            bind:value={network}
            on:change={onNetworkChanged}
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <option value="mainnet">Mainnet</option>
                <option value="testnet">Testnet</option>
            </select>
        </div>
    </div>
</div>