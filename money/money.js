var Colu = require('colu');  // Colu SDK
var apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0aWQiOiI1NzJiZmViYTNkNmU0Yzc0NzY3YTgyMTMiLCJleHAiOjE0NjYxMDEwNTA5MDV9.GGeq-t8nGshBG0DCj1mKytDk2DGjHE72XOZgK-XT_x8';  // Colu Api
var USDAssetId = 'LaA3rWco7TGJugdQdF7xFSQgTrPogThxBeTBrt';  // Freemit Dollars AssetId
var privateSeed = '263da4c2186abcfd6b429258842c1224d0c6a354e780212fcc78aca4efcf85aa';
var pubSeedAddress = '1NVXG5252Lq44QYwokZVjhKVg2K1aZ9fcb';

exports.getBalance = function (publicAddress) {  // Get Balance of Public Bitcoin Address
    return new Promise(function (fulfill, reject) { // Create Promise
        var settings = {  // Settings for initializing Colu
            apiKey: apiKey,
            network: 'mainnet',
            privateSeed: null
        };
        var colu = new Colu(settings);
        colu.init();  // Initialize Colu API
        colu.on('connect', function () {  //  Once connected perform function
            colu.coloredCoins.getAddressInfo(publicAddress, function (err, body) {
                if (err) {
                    reject(err); // Return promise rejected
                    return console.error(err);
                }
                else {
                    var total = 0;  // Start with 0
                    for (var i = 0; i < body.utxos.length; i++) {  // Iterate through all bitcoin transactions
                        var assetId = body.utxos[i].assets[0].assetId;  // grab Colored coin AssetId
                        var amount = body.utxos[i].assets[0].amount;  // Get Amount of Assets
                        if (assetId == assetId) {  // Filter out non Freemit Assets
                            total = total + amount;  //  Add to totals
                        }
                    }
                    var results = {
                        AssetName: "USD",
                        AssetTotal: total
                    };
                    // console.log(results);
                    fulfill(results);
                }
            })
        })
    });
};
exports.addMoney = function (currency, amount, publicAddress) {
    return new Promise(function (fulfill, reject) { // Create Promise
        if (currency != "USD") {
            console.log("Rejected");
            reject("Only USD supported");
            return false;
        }
        exports.sendMoney("USD", privateSeed, pubSeedAddress, publicAddress, amount).then(function (result) {
            fufill(result);
        }).catch(function (err) {
            reject(err)
        });
    });
};
exports.sendMoney = function (currency, privateKey, fromAddress, toAddress, amount) {
    return new Promise(function (fulfill, reject) { // Create Promise
        if (currency != "USD") {
            console.log("Rejected");
            reject("Only USD supported");
            return false;
        }
        var send = {
            from: [fromAddress],
            to: [{
                address: toAddress,
                assetId: USDAssetId,
                amount: amount
            }]
        };
        var settings = {  // Settings for initializing Colu
            apiKey: apiKey,
            network: 'mainnet',
            privateSeed: privateKey
        };
        var colu = new Colu(settings);
        colu.on('connect', function () {  //  Once connected perform function
            console.log("connected");
            colu.sendAsset(send, function (err, body) {
                if (err) {
                    console.log(err);
                    reject(err);
                    return console.error(err)
                }
                fulfill(body);
                console.log("Body: ", body);
            });
        });
        colu.init();  // Initialize Colu API
    });
};
exports.getPrivateSeed = function () {
    return new Promise(function (fulfill, reject) { // Create Promise
        var settings = {  // Settings for initializing Colu
            apiKey: apiKey,
            network: 'mainnet',
            privateSeed: null
        };
        var colu = new Colu(settings);
        colu.on('connect', function () {
            var privateSeed = colu.hdwallet.getPrivateSeed();
            var address = colu.hdwallet.getAddress();
            var result = {privateKey: privateSeed, publicKey: address};
            fulfill(result);
        });
        colu.init();
    });
};



