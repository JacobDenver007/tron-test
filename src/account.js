const { tronWeb, testSingleSignAccount, testMultiSignAccounts, sleep, transfer } = require('./config')

async function updateAccountToMultiSignAccount(priv, ownerAddress, ownerPermission, activePermission) {
    const updateTransaction = await tronWeb.transactionBuilder.updateAccountPermissions(
        ownerAddress,
        ownerPermission,
        null,
        [activePermission]
    );

    // broadcast update transaction
    const signedUpdateTransaction = await tronWeb.trx.sign(updateTransaction, priv, null, false);
    let tx = await tronWeb.trx.broadcast(signedUpdateTransaction);
    console.log("tx ", tx)
    await sleep(3000)
}

async function main() {
    // // init new account, this account can not be found on chain now.
    // let account = await tronWeb.createAccount()
    // console.log("initial account ", account)

    // transfer some trx to this new account to make this account have state on chain.
    let amount = 200000000
    await transfer(testSingleSignAccount.address, testMultiSignAccounts.owner.keys[0].address, amount, testSingleSignAccount.priv)
    console.log("transfer 200 trx to new account")

    // update new account to a multi sign account
    let ownerAddress = tronWeb.address.toHex(testMultiSignAccounts.owner.keys[0].address)

    let ownerPermission = {
        type: testMultiSignAccounts.owner.type,
        permission_name: testMultiSignAccounts.owner.permission_name,
        threshold: testMultiSignAccounts.owner.threshold,
        keys: [{
            address: tronWeb.address.toHex(testMultiSignAccounts.owner.keys[0].address),
            weight: testMultiSignAccounts.owner.keys[0].weight
        }]
    }

    let activePermission = {
        type: testMultiSignAccounts.active.type,
        permission_name: testMultiSignAccounts.active.permission_name,
        threshold: testMultiSignAccounts.active.threshold,
        operations: testMultiSignAccounts.active.operations,
        keys: [{
            address: tronWeb.address.toHex(testMultiSignAccounts.active.keys[0].address),
            weight: testMultiSignAccounts.active.keys[0].weight
        }, {
            address: tronWeb.address.toHex(testMultiSignAccounts.active.keys[1].address),
            weight: testMultiSignAccounts.active.keys[1].weight
        }]
    }
    await updateAccountToMultiSignAccount(testMultiSignAccounts.owner.keys[0].priv, ownerAddress, ownerPermission, activePermission)

    updatedAccount = await tronWeb.trx.getAccount(ownerAddress)
    console.log(updatedAccount)
}

main();
