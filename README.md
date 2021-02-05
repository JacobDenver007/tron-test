# tron-test

### 工具

#### 网页钱包

使用 tronlink 钱包：
[tronlink](https://chrome.google.com/webstore/detail/tronlink%EF%BC%88%E6%B3%A2%E5%AE%9D%E9%92%B1%E5%8C%85%EF%BC%89/ibnejdfjmmkpcnlpebklmnkoeoihofec?hl=en-US)

#### 环境

nile 测试网
[nile 测试网信息 & 水龙头](https://nileex.io/)

### tron 多签

详细介绍请参考：
[TRON协议—多重签名](http://www.btb8.com/trx/1905/46785.html)

总结下来有以下几点重点：

- tron 多签功能允许权限分级，每个权限可以对应多个私钥
- tron 有三种权限级别，owner，witness，active
- owner 有所有权限，刚创建的普通地址会默认把地址绑定到 owner，witness 用于出块，active 是自定义权限，最多有 8 个 active
- owner 或者是拥有 updateAccountPermissions 权限的 active 可以通过执行 updateAccountPermissions 函数来修改所有的权限
- active 结构
```
    let activePermission = {
        type: 2,  // active 的 type 从 2 开始，0 是 owner，1 是 witness
        permission_name: "active0", 
        threshold: 2, // 阈值
        operations: '7fff1fc0037e0000000000000000000000000000000000000000000000000000', // 该 active 权限能做的操作，具体生成方法请见 ```TRON协议—多重签名``` 文档
        keys: [{
            address: testAccounts[0].address,
            weight: 1
        }, {
            address: testAccounts[1].address,
            weight: 1
        }]
    }
```

### tron 交易

tron 通用的有三种火币
- TRX
- TRC10 也是原生货币，但是区别于 TRX，统称为 TRC10
- TRC20 类似 ERC20，是合约货币