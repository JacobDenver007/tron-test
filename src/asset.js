const {
  tronWeb,
  testSingleSignAccount,
  testMultiSignAccounts,
  sleep,
  transfer,
} = require("./config");

async function createTestTRC10Token(tronWeb, issuerAddress, privateKey) {
  try {
    let options = {
      name: "SpongeBobToken",
      abbreviation: "nhancv",
      description: "SpongeBobToken for Test",
      url: "nhancv.com",
      totalSupply: 1000000000,
      trxRatio: 1, // How much TRX will tokenRatio cost?
      tokenRatio: 1, // How many tokens will trxRatio afford?
      saleStart: Date.now() + 10000, // sale start mus > now
      saleEnd: Date.now() + 31536000000, // 365 days
      freeBandwidth: 0, // The creator's "donated" bandwidth for use by token holders
      freeBandwidthLimit: 0, // Out of totalFreeBandwidth, the amount each token holder get
      frozenAmount: 0,
      frozenDuration: 0,
    };
    const issuerHex = tronWeb.address.toHex(issuerAddress);
    const rawTxObj = await tronWeb.transactionBuilder.createToken(
      options,
      issuerHex
    );
    // https://shasta.tronscan.org/#/
    console.log({ rawTxObj });
    const signedUpdateTransaction = await tronWeb.trx.sign(
      rawTxObj,
      privateKey
    );
    const res = await tronWeb.trx.broadcast(signedUpdateTransaction);
    console.log({ res });
  } catch (e) {
    console.error(e);
  }
}

async function main() {
  await createTestTRC10Token(
    tronWeb,
    testSingleSignAccount.address,
    testSingleSignAccount.priv
  );
}

main();
