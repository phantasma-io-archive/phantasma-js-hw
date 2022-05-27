# for debug purposes, convert bip44 mnemonic to Poltergeist Mnemonic

        npm start getpoltergeistmnemonic $MNEMONIC

# get balance from mnemonic (put the whole mnemonic in quotes):

        npm start getmbalance $MNEMONIC

        response

        address P2K7u99esqB1F5py6XpFctd67U8Ay1SjpoLLaqxZiBH7ge4
        balances { SOUL: '0.10000000', KCAL: '1.1000000000' }


        npm start getmbalance 'yard impulse luxury drive today throw farm pepper survey wreck glass federal'

        response

        phantasma-js-hw
        address P2KAe9vx5vHhSutFZnkEvv37CtN6qtqaHECab6q1vCnG5Uy
        balances {}

# get device info from ledger:

        npm start linfo

        response

        phantasma-js-hw
        info {
          enabled: true,
          error: false,
          message: 'Ledger Device Found.',
          deviceInfo: { manufacturer: 'Ledger', product: 'Nano S', serialNumber: '0001' }
        }

# get balance from ledger:

        npm start getlbalance

        response

        phantasma-js-hw
        address P2K7u99esqB1F5py6XpFctd67U8Ay1SjpoLLaqxZiBH7ge4
        balance 1000000000000

# confirm address on ledger device

        npm start getladdress

        response

        phantasma-js-hw
        address P2K7u99esqB1F5py6XpFctd67U8Ay1SjpoLLaqxZiBH7ge4
        balance 1000000000000

# send amount from mnemonic (put the whole mnemonic in quotes):

## send to self.

        npm start msend 10 KCAL P2K7u99esqB1F5py6XpFctd67U8Ay1SjpoLLaqxZiBH7ge4 $MNEMONIC

        npm start msend 11 SOUL P2K7u99esqB1F5py6XpFctd67U8Ay1SjpoLLaqxZiBH7ge4 $MNEMONIC

## send to other address.
        npm start msend 10 KCAL P2KAe9vx5vHhSutFZnkEvv37CtN6qtqaHECab6q1vCnG5Uy $MNEMONIC

## send back from other address.
        npm start msend 10 KCAL P2K7u99esqB1F5py6XpFctd67U8Ay1SjpoLLaqxZiBH7ge4 'yard impulse luxury drive today throw farm pepper survey wreck glass federal'

## send to other address.
        npm start msend 1000000000 KCAL P2KAe9vx5vHhSutFZnkEvv37CtN6qtqaHECab6q1vCnG5Uy $MNEMONIC

## send back from other address.
        npm start msend 100000000 SOUL P2K7u99esqB1F5py6XpFctd67U8Ay1SjpoLLaqxZiBH7ge4 $MNEMONIC

        npm start msend 1000000000 KCAL P2K7u99esqB1F5py6XpFctd67U8Ay1SjpoLLaqxZiBH7ge4 $MNEMONIC

# send amount fromledger:

        # 1 raw KCAL
        npm start lsend 1 KCAL P2K7u99esqB1F5py6XpFctd67U8Ay1SjpoLLaqxZiBH7ge4

        # 1 raw SOUL
        npm start lsend 1 SOUL P2K7u99esqB1F5py6XpFctd67U8Ay1SjpoLLaqxZiBH7ge4

        # 10 raw
        npm start lsend 10 KCAL P2K7u99esqB1F5py6XpFctd67U8Ay1SjpoLLaqxZiBH7ge4

        # 1 KCAL, 100,000,000 raw
        npm start lsend 100000000 KCAL P2K7u99esqB1F5py6XpFctd67U8Ay1SjpoLLaqxZiBH7ge4

        # 1 SOUL, 100,000,000 raw
        npm start lsend 100000000 SOUL P2K7u99esqB1F5py6XpFctd67U8Ay1SjpoLLaqxZiBH7ge4

        # 10 KCAL, 1,000,000,000 raw
        npm start lsend 1000000000 KCAL P2K7u99esqB1F5py6XpFctd67U8Ay1SjpoLLaqxZiBH7ge4

        # 1 SOUL, 100,000,000 raw
        npm start lsend 100000000 SOUL P2KAe9vx5vHhSutFZnkEvv37CtN6qtqaHECab6q1vCnG5Uy

        # 10 KCAL, 1,000,000,000 raw
        npm start lsend 1000000000 KCAL P2KAe9vx5vHhSutFZnkEvv37CtN6qtqaHECab6q1vCnG5Uy

        # 12,345,678.90123456 KCAL, 1,234,567,890,123,456 raw
        npm start lsend 1234567890123456 KCAL P2K7u99esqB1F5py6XpFctd67U8Ay1SjpoLLaqxZiBH7ge4
