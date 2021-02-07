const { tronWeb, testSingleSignAccount, testMultiSignAccounts, trc10TokenID, trc20ContractAddress, transfer } = require('./config')

async function multiSignTransfer(from, to, amount, memo) {
    let unsigned_tx = await tronWeb.transactionBuilder.sendTrx(to, amount, from, { permissionId: 2 })

    let unsignedWithMemoTx = await tronWeb.transactionBuilder.addUpdateData(unsigned_tx, memo, "utf8")

    let signed_tx = unsignedWithMemoTx
    for (let i = 0; i < testMultiSignAccounts.active.keys.length; i++) {
        signed_tx = await tronWeb.trx.multiSign(signed_tx, testMultiSignAccounts.active.keys[i].priv);
    }

    let broad_tx = await tronWeb.trx.broadcast(signed_tx)
    return broad_tx
}

async function transferTrc10(from, to, amount, tokenID, memo) {
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

async function transferTrc20(from, to, amount, memo) {
    let options = {}
    let functionSelector = 'transfer(address,uint256)'
    let params = [
        { type: 'address', value: to },
        { type: 'uint256', value: amount }
    ]

    let unsigned_tx = await tronWeb.transactionBuilder.triggerSmartContract(trc20ContractAddress, functionSelector, options, params, from)
    let unsignedWithMemoTx = await tronWeb.transactionBuilder.addUpdateData(unsigned_tx.transaction, memo, "utf8")

    let signed_tx = await tronWeb.trx.sign(unsignedWithMemoTx, testSingleSignAccount.priv)
    let broad_tx = await tronWeb.trx.broadcast(signed_tx)
    return broad_tx
}

async function transferTrc20WithMultiSign(from, to, amount, memo) {
    let options = {
        permissionId: 2,
        feeLimit: 1000000,
    }
    let functionSelector = 'transfer(address,uint256)'
    let params = [
        { type: 'address', value: to },
        { type: 'uint256', value: amount }
    ]

    let unsigned_tx = await tronWeb.transactionBuilder.triggerSmartContract(trc20ContractAddress, functionSelector, options, params, from)
    let unsignedWithMemoTx = await tronWeb.transactionBuilder.addUpdateData(unsigned_tx.transaction, memo, "utf8")
    console.log(unsignedWithMemoTx)

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
    tx = await transferTrc10(testSingleSignAccount.address, testMultiSignAccounts.owner.keys[0].address, amount, trc10TokenID, singleToMultiTrc10Memo)
    console.log("transfer trz from single to multi", tx)

    // transfer trc10 from multi to single
    let multiToSingleTrc10Memo = "multi transfer 100 TRZ to single"
    tx = await transferTrc10WithMultiSign(testMultiSignAccounts.owner.keys[0].address, testSingleSignAccount.address, amount, trc10TokenID, multiToSingleTrc10Memo)
    console.log("transfer trz from multi to single", tx)

    // transfer trc20 from single to multi
    let singleToMultiTrc20Memo = "single transfer 100 USDJ to multi"
    tx = await transferTrc20(testSingleSignAccount.address, testMultiSignAccounts.owner.keys[0].address, amount, singleToMultiTrc20Memo)
    console.log("transfer usdj from single to multi", tx)

    // transfer trc20 from multi to single
    let multiToSingleTrc20Memo = "multi transfer 100 USDJ to single"
    tx = await transferTrc20WithMultiSign(testMultiSignAccounts.owner.keys[0].address, testSingleSignAccount.address, amount, multiToSingleTrc20Memo)
    console.log("transfer usdj from multi to single", tx)

}

main();
