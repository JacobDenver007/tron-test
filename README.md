### 测试准备

- 使用 nile 测试网 https://nileex.io/
- 申请一个测试网账号，且在水龙头申请到 TRX，TRC10，TRC20 代币

### 创建一个多签账户

- 修改 src/config.js 文件以下内容，其中 ``` testSingleSignAccount ``` 填写我们上一步申请到的账号信息，``` testMultiSignAccounts ``` 是我们将要创建的多签账号信息，此处可以自定义
```
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
```

- 执行 ``` yarn create_account ```
- 创建完毕可以在测试网浏览器查看

### 发送交易

- 查看 src/tx.js，此文件包含了 6 笔交易，分别是 TRX，TRC10，TRC20 的单签和多签转账
- 执行 ``` yarn tx ```

### 查询交易

- 查看 src/analyze.js，使用了 trongrid 的接口获取指定要查询的地址的历史交易
- trongrid 接口 https://cn.developers.tron.network/docs/trongridjs

> note: TRX 和 TRC10 使用 ``` getTransactions ``` 接口，TRC20 使用 ``` getTrc20Transactions ``` 接口
