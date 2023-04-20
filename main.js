const aptos = require('aptos');
const express = require('express');
const app = express();
const port = 8000;
const path = require('path');

app.get('/coin_details', async (req, res) => {
    var address = 'a9f715f996c6174c4ce5eebfc68cc359936741d430657824885c9b158b7382da';
    var resource_type = '0x1::coin::CoinInfo<0xa9f715f996c6174c4ce5eebfc68cc359936741d430657824885c9b158b7382da::DemoCoin::DemoCoin>';
    const URL = `https://fullnode.testnet.aptoslabs.com/v1/accounts/${address}/resource/${resource_type}`;
    await fetch(URL)
        .then(response => { return response.json() })
        .then(data => {
            coin_symbol = data.data.symbol;
            total_supply = (data.data.supply.vec[0].integer.vec[0].value) / 10**8;
            res.send(`Coin Name: <b>${data.data.name}</b><br><br>Coin Symbol: <b>${data.data.symbol}</b><br><br>Coin Decimal: <b>${data.data.decimals}</b><br><br>Coin Supply: <b>${total_supply}${coin_symbol}</b>`);
        })
        .catch(err => {
            res.send(err)
        });
})

app.get('/transfer_amount', async (req, res) => {
    //-------------------------------------------------->
    var coin_name, coin_symbol;
    var address = 'a9f715f996c6174c4ce5eebfc68cc359936741d430657824885c9b158b7382da';
    var resource_type = '0x1::coin::CoinInfo<0xa9f715f996c6174c4ce5eebfc68cc359936741d430657824885c9b158b7382da::DemoCoin::DemoCoin>';
    const URL = `https://fullnode.testnet.aptoslabs.com/v1/accounts/${address}/resource/${resource_type}`;
    await fetch(URL)
        .then(response => { return response.json() })
        .then(data => {
            coin_name = data.data.name;
            coin_symbol = data.data.symbol;
        })
        .catch(err => {
            res.send(err)
        });
    //-------------------------------------------------->

    const client = new aptos.AptosClient("https://fullnode.testnet.aptoslabs.com");
    const sign = {
        address: "21a086aa8690771397d4bf5156901b9b0789785629eef2ddc04d36a55511e021",
        publicKeyHex: "0x1dd541dc1ce6ff2b8000c7d3e4366373300668ff7b3ea9cc3960c61770f17bc0",
        privateKeyHex: "0x55a21a88919f44882e23e9b40c034a466c8cab7482e6dc011d156d19f5d1824b1dd541dc1ce6ff2b8000c7d3e4366373300668ff7b3ea9cc3960c61770f17bc0"
    };

    const aptos_account = aptos.AptosAccount.fromAptosAccountObject(sign);
    const decimal_amount = parseFloat(req.query.amount) * 10 ** 8;
    const payload = {
        type: "entry_function_payload",
        function: "0xa9f715f996c6174c4ce5eebfc68cc359936741d430657824885c9b158b7382da::DemoCoin::transfer_coin",
        type_arguments: [],
        arguments: [req.query.address, decimal_amount],
    };
    const txnRequest = await client.generateTransaction(aptos_account.address(), payload);
    const signedTxn = await client.signTransaction(aptos_account, txnRequest);
    const transactionRes = await client.submitTransaction(signedTxn);
    await client.waitForTransaction(transactionRes.hash);
    res.send(`<b>${req.query.amount}${coin_symbol}</b> transfered to <b>${req.query.address}</b><br><br>Transaction Hash:<a href="https://explorer.aptoslabs.com/txn/${transactionRes.hash}" target="_blank">${transactionRes.hash}</a>`);
})

app.get('/freeze', async (req, res) => {
    const client = new aptos.AptosClient("https://fullnode.testnet.aptoslabs.com");
    const sign = {
        address: "21a086aa8690771397d4bf5156901b9b0789785629eef2ddc04d36a55511e021",
        publicKeyHex: "0x1dd541dc1ce6ff2b8000c7d3e4366373300668ff7b3ea9cc3960c61770f17bc0",
        privateKeyHex: "0x55a21a88919f44882e23e9b40c034a466c8cab7482e6dc011d156d19f5d1824b1dd541dc1ce6ff2b8000c7d3e4366373300668ff7b3ea9cc3960c61770f17bc0"
    };

    const aptos_account = aptos.AptosAccount.fromAptosAccountObject(sign);
    const payload = {
        type: "entry_function_payload",
        function: "0xa9f715f996c6174c4ce5eebfc68cc359936741d430657824885c9b158b7382da::DemoCoin::emergency_freeze",
        type_arguments: [],
        arguments: [req.query.address],
    };
    const txnRequest = await client.generateTransaction(aptos_account.address(), payload);
    const signedTxn = await client.signTransaction(aptos_account, txnRequest);
    const transactionRes = await client.submitTransaction(signedTxn);
    await client.waitForTransaction(transactionRes.hash);
    res.send(`<b>${req.query.address} Freezed.</b><br><br>Transaction Hash:<a href="https://explorer.aptoslabs.com/txn/${transactionRes.hash}" target="_blank">${transactionRes.hash}</a>`);
})

app.get('/unfreeze', async (req, res) => {
    const client = new aptos.AptosClient("https://fullnode.testnet.aptoslabs.com");
    const sign = {
        address: "21a086aa8690771397d4bf5156901b9b0789785629eef2ddc04d36a55511e021",
        publicKeyHex: "0x1dd541dc1ce6ff2b8000c7d3e4366373300668ff7b3ea9cc3960c61770f17bc0",
        privateKeyHex: "0x55a21a88919f44882e23e9b40c034a466c8cab7482e6dc011d156d19f5d1824b1dd541dc1ce6ff2b8000c7d3e4366373300668ff7b3ea9cc3960c61770f17bc0"
    };

    const aptos_account = aptos.AptosAccount.fromAptosAccountObject(sign);
    const payload = {
        type: "entry_function_payload",
        function: "0xa9f715f996c6174c4ce5eebfc68cc359936741d430657824885c9b158b7382da::DemoCoin::unfreeze",
        type_arguments: [],
        arguments: [req.query.address],
    };
    const txnRequest = await client.generateTransaction(aptos_account.address(), payload);
    const signedTxn = await client.signTransaction(aptos_account, txnRequest);
    const transactionRes = await client.submitTransaction(signedTxn);
    await client.waitForTransaction(transactionRes.hash);
    res.send(`<b>${req.query.address} Unfreezed.</b><br><br>Transaction Hash:<a href="https://explorer.aptoslabs.com/txn/${transactionRes.hash}" target="_blank">${transactionRes.hash}</a>`);
})

app.get('/check_balance', async (req, res) => {
    var address = req.query.address;
    var resource_type = '0x1::coin::CoinStore<0xa9f715f996c6174c4ce5eebfc68cc359936741d430657824885c9b158b7382da::DemoCoin::DemoCoin>';
    const URL = `https://fullnode.testnet.aptoslabs.com/v1/accounts/${address}/resource/${resource_type}`;
    await fetch(URL)
        .then(response => { return response.json() })
        .then(data => {
            dc_balance = (data.data.coin.value) / 10**8;
            res.send(`Available Balance: <b>${dc_balance}DC</b>`);
        })
        .catch(err => {
            res.send(err)
        });
})

app.get('/transfer_other', async (req, res) => {

    /////////////
    var address_from = req.query.addr_from;
    var pubKey = req.query.pub;
    var filteredPubKey = pubKey.slice(2,);
    var pvtKey = req.query.pvt;
    var sign_pvt = pvtKey+filteredPubKey;
    var dc_balance;
    var resource_type = '0x1::coin::CoinStore<0xa9f715f996c6174c4ce5eebfc68cc359936741d430657824885c9b158b7382da::DemoCoin::DemoCoin>';
    const URL = `https://fullnode.testnet.aptoslabs.com/v1/accounts/${address_from}/resource/${resource_type}`;
    /////////////

    const client = new aptos.AptosClient("https://fullnode.testnet.aptoslabs.com");
    const sign = {
        address: address_from,
        publicKeyHex: pubKey,
        privateKeyHex: sign_pvt
    };

    const aptos_account = aptos.AptosAccount.fromAptosAccountObject(sign);
    const decimal_amount = parseFloat(req.query.amount) * 10 ** 8;
    const payload = {
        type: "entry_function_payload",
        function: `0xa9f715f996c6174c4ce5eebfc68cc359936741d430657824885c9b158b7382da::DemoCoin::transfer_coin`,
        type_arguments: [],
        arguments: [req.query.addr_to, decimal_amount],
    };
    const txnRequest = await client.generateTransaction(aptos_account.address(), payload);
    const signedTxn = await client.signTransaction(aptos_account, txnRequest);
    const transactionRes = await client.submitTransaction(signedTxn);
    await client.waitForTransaction(transactionRes.hash);

    /////
    await fetch(URL)
        .then(response => { return response.json() })
        .then(data => {
            dc_balance = (data.data.coin.value) / 10**8;
        })
        .catch(err => {
            res.send(err)
        });
    ///
    res.send(`<b>${req.query.amount}DC</b> transfered to <b>${req.query.addr_to}</b><br><br>Transaction Hash:<a href="https://explorer.aptoslabs.com/txn/${transactionRes.hash}" target="_blank">${transactionRes.hash}</a><br><br>Available Balance: ${dc_balance}`);
})

app.get('/mint_coin', async (req, res) => {
    const client = new aptos.AptosClient("https://fullnode.testnet.aptoslabs.com");
    const sign = {
        address: "21a086aa8690771397d4bf5156901b9b0789785629eef2ddc04d36a55511e021",
        publicKeyHex: "0x1dd541dc1ce6ff2b8000c7d3e4366373300668ff7b3ea9cc3960c61770f17bc0",
        privateKeyHex: "0x55a21a88919f44882e23e9b40c034a466c8cab7482e6dc011d156d19f5d1824b1dd541dc1ce6ff2b8000c7d3e4366373300668ff7b3ea9cc3960c61770f17bc0"
    };

    const aptos_account = aptos.AptosAccount.fromAptosAccountObject(sign);
    const decimal_amount = parseFloat(req.query.amount) * 10 ** 8;
    const payload = {
        type: "entry_function_payload",
        function: "0xa9f715f996c6174c4ce5eebfc68cc359936741d430657824885c9b158b7382da::DemoCoin::mint_coin",
        type_arguments: [],
        arguments: [req.query.address, decimal_amount],
    };
    const txnRequest = await client.generateTransaction(aptos_account.address(), payload);
    const signedTxn = await client.signTransaction(aptos_account, txnRequest);
    const transactionRes = await client.submitTransaction(signedTxn);
    await client.waitForTransaction(transactionRes.hash);
    res.send(`<b>${req.query.amount}DC</b> Minted to <b>${req.query.address}</b><br><br>Transaction Hash:<a href="https://explorer.aptoslabs.com/txn/${transactionRes.hash}" target="_blank">${transactionRes.hash}</a>`);
})

app.get('/register', async (req, res) => {

    /////////////
    var address = req.query.addr;
    var pubKey = req.query.pub;
    var filteredPubKey = pubKey.slice(2,);
    var pvtKey = req.query.pvt;
    var sign_pvt = pvtKey+filteredPubKey;
    var dc_balance;
    var resource_type = '0x1::coin::CoinStore<0xa9f715f996c6174c4ce5eebfc68cc359936741d430657824885c9b158b7382da::DemoCoin::DemoCoin>';
    const URL = `https://fullnode.testnet.aptoslabs.com/v1/accounts/${address}/resource/${resource_type}`;

    const client = new aptos.AptosClient("https://fullnode.testnet.aptoslabs.com");
    const sign = {
        address: address,
        publicKeyHex: pubKey,
        privateKeyHex: sign_pvt
    };

    const aptos_account = aptos.AptosAccount.fromAptosAccountObject(sign);
    const payload = {
        type: "entry_function_payload",
        function: `0xa9f715f996c6174c4ce5eebfc68cc359936741d430657824885c9b158b7382da::DemoCoin::register`,
        type_arguments: [],
        arguments: [],
    };
    const txnRequest = await client.generateTransaction(aptos_account.address(), payload);
    const signedTxn = await client.signTransaction(aptos_account, txnRequest);
    const transactionRes = await client.submitTransaction(signedTxn);
    await client.waitForTransaction(transactionRes.hash);

    /////
    await fetch(URL)
        .then(response => { return response.json() })
        .then(data => {
            dc_balance = (data.data.coin.value) / 10**8;
        })
        .catch(err => {
            res.send(err)
        });
    ///
    res.send(`Coin registered for <b>${address}</b><br><br>Transaction Hash:<a href="https://explorer.aptoslabs.com/txn/${transactionRes.hash}" target="_blank">${transactionRes.hash}</a><br><br>Available Balance: ${dc_balance}<br><br>${resource}`);
})

app.get("/transfer", async (req, res) => {
    res.sendFile(path.join(__dirname, 'transfer.html'));
})

app.get("/home", async (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
})

app.get("/check_bal", async (req, res) => {
    res.sendFile(path.join(__dirname, 'check_balance.html'));
})

app.get("/mint", async (req, res) => {
    res.sendFile(path.join(__dirname, 'mint_page.html'));
})

app.get("/transfer_from_other", async (req, res) => {
    res.sendFile(path.join(__dirname, 'trans_other.html'));
})

app.get("/register_coin", async (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
})

app.listen(port, async (req, res) => {
    console.log(`Listening to ${port}`);
})
