const { tronWeb, testAccounts } = require('./config')

async function multiSignTransfer(from, to, amount) {
    let from_hex = tronWeb.address.toHex(from)
    let to_hex = tronWeb.address.toHex(to)

    let unsigned_tx = await tronWeb.transactionBuilder.sendTrx(to_hex, amount, from_hex, { permissionId: 2 })

    let signed_tx = unsigned_tx
    for (let i = 0; i < testAccounts.length; i++) {
        signed_tx = await tronWeb.trx.multiSign(signed_tx, testAccounts[i].priv);
    }

    let broad_tx = await tronWeb.trx.broadcast(signed_tx)
    return broad_tx
}

// TS6VejPL8cQy6pA8eDGyusmmhCrXHRdJK6 is a single sign address
// TBLawZpUkz4yKhD8RzKbq4fKVaZDwkg7h1 is a multi sign address
async function main() {
    let from = "TX3MGfWT5aGv81vTSdZtr6hbHxhMVh1FFM"
    let to = "TS6VejPL8cQy6pA8eDGyusmmhCrXHRdJK6"
    let amount = 100
    tx = await multiSignTransfer(from, to, amount)
    console.log(tx)
}

main();
