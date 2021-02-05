const TronWeb = require('tronweb');

const tronWeb = new TronWeb({
    fullHost: 'https://nile.trongrid.io/'
});

const testAccounts = [{
    priv: "CA2B646CFF30E9CE13864F61CEF5F7C40E8720FA8310B00228F61D14EB761061",
    address: "418DF34432AFE5C63851E45A8EE47D8079F1B6EA3F"
}, {
    priv: "EE782FE170F680D6CAB340ECA5ED2F6E05B0B9809082CF745207E87734211C72",
    address: "410F032CE6945A375754821B1E6017C6E838F7C058"
}]

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

async function transfer(from, to, amount, priv) {
    let from_hex = tronWeb.address.toHex(from)
    let to_hex = tronWeb.address.toHex(to)

    let unsigned_tx = await tronWeb.transactionBuilder.sendTrx(to_hex, amount, from_hex)
    let signed_tx = await tronWeb.trx.sign(unsigned_tx, priv)
    let broad_tx = await tronWeb.trx.broadcast(signed_tx)
    return broad_tx
}

module.exports = {
    sleep,
    transfer,
    tronWeb,
    testAccounts
}

