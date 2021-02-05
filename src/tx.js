const { tronWeb, testSingleSignAccount, testMultiSignAccounts, transfer } = require('./config')

async function multiSignTransfer(from, to, amount, memo) {
    let from_hex = tronWeb.address.toHex(from)
    let to_hex = tronWeb.address.toHex(to)

    let unsigned_tx = await tronWeb.transactionBuilder.sendTrx(to_hex, amount, from_hex, { permissionId: 2 })

    let unsignedWithMemoTx = await tronWeb.transactionBuilder.addUpdateData(unsigned_tx, memo, "utf8")

    let signed_tx = unsignedWithMemoTx
    for (let i = 0; i < testMultiSignAccounts.active.keys.length; i++) {
        signed_tx = await tronWeb.trx.multiSign(signed_tx, testMultiSignAccounts.active.keys[i].priv);
    }

    let broad_tx = await tronWeb.trx.broadcast(signed_tx)
    return broad_tx
}

// TS6VejPL8cQy6pA8eDGyusmmhCrXHRdJK6 is a single sign address
// TBLawZpUkz4yKhD8RzKbq4fKVaZDwkg7h1 is a multi sign address
async function main() {
    // transfer from single to multi
    let amount = 100
    let singleToMultiMemo = "single transfer 100 SUN to multi"
    tx = await transfer(testSingleSignAccount.address, testMultiSignAccounts.owner.keys[0].address, amount, singleToMultiMemo, testSingleSignAccount.priv)
    console.log(tx)

    let multiToSingleMemo = "multi transfer 100 SUN to single"
    tx = await multiSignTransfer(testMultiSignAccounts.owner.keys[0].address, testSingleSignAccount.address, amount, multiToSingleMemo)
    console.log(tx)
}

main();
