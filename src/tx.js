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

async function transferTrc10(from, to, amount, tokenID, memo) {
    from = tronWeb.address.toHex(from)
    to = tronWeb.address.toHex(to)

    let unsigned_tx = await tronWeb.transactionBuilder.sendToken(to, amount, tokenID, from)
    let unsignedWithMemoTx = await tronWeb.transactionBuilder.addUpdateData(unsigned_tx, memo, "utf8")
    let signed_tx = await tronWeb.trx.sign(unsignedWithMemoTx, testSingleSignAccount.priv)
    let broad_tx = await tronWeb.trx.broadcast(signed_tx)
    return broad_tx
}

async function transferTrc10WithMultiSign(from, to, amount, tokenID, memo) {
    let unsigned_tx = await tronWeb.transactionBuilder.sendToken(to, amount, tokenID, from, { permissionId: 2 })

    let unsignedWithMemoTx = await tronWeb.transactionBuilder.addUpdateData(unsigned_tx, memo, "utf8")

    let signed_tx = unsignedWithMemoTx
    for (let i = 0; i < testMultiSignAccounts.active.keys.length; i++) {
        signed_tx = await tronWeb.trx.multiSign(signed_tx, testMultiSignAccounts.active.keys[i].priv);
    }

    let broad_tx = await tronWeb.trx.broadcast(signed_tx)
    return broad_tx
}

async function main() {
    // transfer trx from single to multi
    let amount = 100
    let singleToMultiMemo = "single transfer 100 SUN to multi"
    tx = await transfer(testSingleSignAccount.address, testMultiSignAccounts.owner.keys[0].address, amount, singleToMultiMemo, testSingleSignAccount.priv)
    console.log("transfer trx from single to multi", tx)

    // transfer trx from multi to single
    let multiToSingleMemo = "multi transfer 100 SUN to single"
    tx = await multiSignTransfer(testMultiSignAccounts.owner.keys[0].address, testSingleSignAccount.address, amount, multiToSingleMemo)
    console.log("transfer trx from multi to single", tx)

    // transfer trc10 from single to multi
    let singleToMultiTrc10Memo = "single transfer 100 TRZ to multi"
    let trc10TokenID = '1000016' // Token is TRZ
    tx = await transferTrc10(testSingleSignAccount.address, testMultiSignAccounts.owner.keys[0].address, amount, trc10TokenID, singleToMultiTrc10Memo)
    console.log("transfer trz from single to multi", tx)

    // transfer trc10 from multi to single
    let multiToSingleTrc10Memo = "multi transfer 100 TRZ to single"
    tx = await transferTrc10WithMultiSign(testMultiSignAccounts.owner.keys[0].address, testSingleSignAccount.address, amount, trc10TokenID, multiToSingleTrc10Memo)
    console.log("transfer trz from multi to single", tx)

}

main();
