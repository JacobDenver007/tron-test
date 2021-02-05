const { tronWeb, testAccounts, sleep, transfer } = require('./config')

async function updateAccountToMultiSignAccount(account, ownerAddress, ownerPermission, activePermission) {
    const updateTransaction = await tronWeb.transactionBuilder.updateAccountPermissions(
        ownerAddress,
        ownerPermission,
        null,
        [activePermission]
    );

    // broadcast update transaction
    const signedUpdateTransaction = await tronWeb.trx.sign(updateTransaction, account.privateKey, null, false);
    let tx = await tronWeb.trx.broadcast(signedUpdateTransaction);
    console.log("tx ", tx)
    await sleep(3000)
}

async function main() {
    // init new account, this account can not be found on chain now.
    let account = await tronWeb.createAccount()
    console.log("initial account ", account)

    // transfer some trx to this new account to make this account have state on chain.
    let from = "TS6VejPL8cQy6pA8eDGyusmmhCrXHRdJK6"
    let to = account.address.base58
    let amount = 200000000
    let priv = "AECC2FBC0BF175DDD04BD1BC3B64A13DB98738962A512544C89B50F5DDB7EBBD"
    await transfer(from, to, amount, priv)

    // update new account to a multi sign account
    let ownerAddress = account.address.hex

    let ownerPermission = {
        type: 0,
        permission_name: "owner",
        threshold: 1,
        keys: [{
            address: account.address.hex,
            weight: 1
        }]
    }

    let activePermission = {
        type: 2,
        permission_name: "active0",
        threshold: 2,
        operations: '7fff1fc0037e0000000000000000000000000000000000000000000000000000',
        keys: [{
            address: testAccounts[0].address,
            weight: 1
        }, {
            address: testAccounts[1].address,
            weight: 1
        }]
    }
    await updateAccountToMultiSignAccount(account, ownerAddress, ownerPermission, activePermission)
}

main();
