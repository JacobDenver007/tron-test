const { tronWeb, tronGrid, testSingleSignAccount, testMultiSignAccounts, transfer } = require('./config')

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

async function main() {
    let address = tronWeb.address.toHex(testMultiSignAccounts.owner.keys[0].address)

    let txs = await getAccountTxs(address)
    console.log(txs)
}

main();