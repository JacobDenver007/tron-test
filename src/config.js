const TronWeb = require('tronweb');
const TronGrid = require('trongrid');

const tronWeb = new TronWeb({
    fullHost: 'https://nile.trongrid.io/'
});

const tronGrid = new TronGrid(tronWeb)

const trc10TokenID = '1000016' // Token is TRZ

const trc20ContractAddress = "TLBaRhANQoJFTqre9Nf1mjuwNWjCJeYqUL"

const testSingleSignAccount = {
    priv: "AECC2FBC0BF175DDD04BD1BC3B64A13DB98738962A512544C89B50F5DDB7EBBD",
    address: "TS6VejPL8cQy6pA8eDGyusmmhCrXHRdJK6"
}

const testMultiSignAccounts = {
    owner: {
        type: 0,
        permission_name: "owner",
        threshold: 1,
        keys: [
            {
                priv: "BBD1CCF77B314365D0673B4F69C85A9104F3EFCE4E276B4EEF7B20C7F237950E",
                address: "TX3MGfWT5aGv81vTSdZtr6hbHxhMVh1FFM",
                weight: 1
            }
        ]
    },
    active: {
        type: 2,
        permission_name: "active0",
        threshold: 2,
        operations: '7fff1fc0037e0000000000000000000000000000000000000000000000000000',
        keys: [{
            priv: "CA2B646CFF30E9CE13864F61CEF5F7C40E8720FA8310B00228F61D14EB761061",
            address: "TNumhZ1mt8k8JvgNbTkV7gryDMpyMvShPo",
            weight: 1,
        }, {
            priv: "EE782FE170F680D6CAB340ECA5ED2F6E05B0B9809082CF745207E87734211C72",
            address: "TBLawZpUkz4yKhD8RzKbq4fKVaZDwkg7h1",
            weight: 1,
        }]
    }
}

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

async function transfer(from, to, amount, memo, priv) {
    let from_hex = tronWeb.address.toHex(from)
    let to_hex = tronWeb.address.toHex(to)

    let unsigned_tx = await tronWeb.transactionBuilder.sendTrx(to_hex, amount, from_hex)
    let unsignedWithMemoTx = await tronWeb.transactionBuilder.addUpdateData(unsigned_tx, memo, "utf8")

    let signed_tx = await tronWeb.trx.sign(unsignedWithMemoTx, priv)
    let broad_tx = await tronWeb.trx.broadcast(signed_tx)
    return broad_tx
}

module.exports = {
    sleep,
    transfer,
    tronWeb,
    tronGrid,
    testSingleSignAccount,
    testMultiSignAccounts,
    trc10TokenID,
    trc20ContractAddress
}

