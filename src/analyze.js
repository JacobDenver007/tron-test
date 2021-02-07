const { tronWeb, tronGrid, trc20ContractAddress, testSingleSignAccount, testMultiSignAccounts, transfer } = require('./config')

async function getAccountTxs(address) {
    let txs = await tronGrid.account.getTransactions(address, { only_to: true, only_confirmed: true, limit: 1 })

    var ret = new Array();
    for (let i = 0; i < txs.data.length; i++) {
        let txRet = {}
        txRet['tx_id'] = txs.data[i].txID
        txRet['memo'] = tronWeb.toUtf8(txs.data[i].raw_data.data)
        ret[i] = txRet
    }
    return ret
}

async function getTrc20Txs(address) {
    var result = await tronGrid.account.getTrc20Transactions(address, {
        only_confirmed: true,
        limit: 2,
        only_to: true,
    });

    var ret = new Array();
    for (let i = 0; i < result.data.length; i++) {
        let txRet = {}
        txRet['tx_id'] = result.data[i].transaction_id
        txRet['contract_address'] = tronWeb.address.fromHex(result.data[i].token_info)

        tx = await tronWeb.trx.getTransaction(result.data[i].transaction_id)
        txRet['memo'] = tronWeb.toUtf8(tx.raw_data.data)
        ret[i] = txRet
    }
    return ret
}

async function main() {
    let address = tronWeb.address.toHex(testMultiSignAccounts.owner.keys[0].address)

    // get trx and trc10 transfer
    txs = await getAccountTxs(address)
    console.log(txs)

    // get trc20 transfer
    txs = await getTrc20Txs(address)
    console.log(txs)
}

main();