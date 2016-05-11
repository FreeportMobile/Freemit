'use strict';

var Colu = require('colu');
var settings = {apiKey: process.env.COLU_APIKEY,network: 'mainnet',privateSeed: null};
var colu = new Colu(settings);

//----- PUBLICLY VISABLE HERE: http://coloredcoins.org/explorer/address/1KCZDRbwhpBh55NPf9mVUQyyCbLzMXopXG

//------------------------------------------------- MAKE HD ADDRESS --------------------------

exports.makeAddress = function () {
    return new Promise(function (fulfill, reject) { // Create Promise
        colu.on('connect', function () {
            var privateSeed = colu.hdwallet.getPrivateSeed();
            var address = colu.hdwallet.getAddress();
            var result = {privateKey: privateSeed, publicKey: address};
            fulfill(result);
        });
        colu.init();
    });
};

//------------------------------------------------- GET ASSET BALLANCE --------------------------

exports.getAssets = function (publicAddress) {  // Get Balance of Public Bitcoin Address
    return new Promise(function (fulfill, reject) { // Create Promise
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
                        if (assetId == process.env.COLU_USD) {  // Filter out non Freemit Assets
                            total = total + amount;  //  Add to totals
                        }
                    } // End loop
                    
                    var results = {
                        AssetName: "USD",
                        AssetTotal: total
                    };
                    fulfill(results);
                }
            })
        })
    });
};

//------------------------------------------------- ADD ASSET TO ADDRESS --------------------------

exports.addAsset = function (currency, amount, publicAddress) {
    return new Promise(function (fulfill, reject) { // Create Promise
        if (currency != "USD") { // TODO: Link this to our database of currencies
            console.log("Rejected");
            reject("Only USD supported");
            return false;
        } 
        exports.sendAsset("USD", "USD", process.env.COLU_PRIVATE_KEY, process.env.COLU_PUBLIC_ADDRESS, publicAddress, amount).then(function (result) {
            fufill(result);
        }).catch(function (err) {
            reject(err)
        });
    });
};

//------------------------------------------------- MOVE / CONVERT ASSET --------------------------
// between bit coin addresss
// amount = amount in fiat currency
// all curecy will not be int, will be a float (2)

exports.moveAsset = function (fromCurrency, toCurrency, privateKey, fromAddress, toAddress, amount) {
    return new Promise(function (fulfill, reject) { // Create Promise
        if (fromCurrency != "USD") { // TODO: Link this to our database of currencies
            console.log("Rejected");
            reject("Only USD supported");
            return false;
        }
        var send = {
            from: [fromAddress],
            to: [{
                address: toAddress,
                assetId: process.env.COLU_USD,
                amount: amount
            }]
        };

        colu.on('connect', function () {  //  Once connected perform function
            console.log("connected");
            colu.sendAsset(send, function (err, body) {
                if (err) {
                    console.log(err);
                    reject(err);
                    return console.error(err);  // START DOING THIS TOO
                }
                fulfill(body);
                console.log("Body: ", body);
            });
        });
        colu.init();  // Initialize Colu API
    });
};

//------------------------------------------------- END --------------------------


