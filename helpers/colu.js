'use strict';

var Colu = require('colu');


//----- PUBLICLY VISABLE HERE: http://coloredcoins.org/explorer/address/1KCZDRbwhpBh55NPf9mVUQyyCbLzMXopXG

//------------------------------------------------- MAKE ADDRESS --------------------------

exports.makeAddress = function () {
    return new Promise(function (fulfill, reject) { // Create Promise
        var colu = new Colu(settings);
        colu.on('connect', function () {
            var privateKey = colu.hdwallet.getPrivateSeed();
            var bitcoinAddress = colu.hdwallet.getAddress();
            var result = {privateKey: privateKey, bitcoinAddress: bitcoinAddress};
            console.log(privateKey);
            console.log(bitcoinAddress);
            console.log(result);
            fulfill(result);
        }); // End Colu
        colu.init();
    }); // End Promise
}; // End Functoiin

//------------------------------------------------- GET ASSET BALLANCE --------------------------

exports.getAssets = function (bitcoinAddress) {  // Get Balance of Public Bitcoin Address
    return new Promise(function (fulfill, reject) { // Create Promise
           
        var settings = {
	        "network": "mainnet",
	        "privateSeed": process.env.COLU_PRIVATE_KEY,
	        "apiKey": process.env.COLU_APIKEY
        }

        var args = 	{
	        "address": bitcoinAddress
        }

        var colu = new Colu(settings)
            colu.on('connect', function () {
	            colu.coloredCoins.getAddressInfo(args.address, function (err, body) {
		            if (err) {
                        reject(err);
			        return;
		            }
                    var total = 0;  
                    for (var i = 0; i < body.utxos.length; i++) {  // Iterate through all bitcoin transactions
                        var assetId = body.utxos[i].assets[0].assetId;  // grab Colored coin AssetId
                        var amount = body.utxos[i].assets[0].amount;  // Get Amount of Assets
           
                        if (assetId == process.env.COLU_USD) {  // Filter out non Freemit Assets
                            total = total + amount;  //  Add to totals 
                        }
                    } // End loop
                
                    var results = {
                        currencyAbbreviation: "USD",
                        total: total,
                    };
                    
                    fulfill(results);
	            }) // END COLOURED COINS
            }) // END COLU
        colu.init()
    }); // End Promise
}; // End Function

//------------------------------------------------- ADD ASSET TO ADDRESS --------------------------

exports.addAsset = function (currency, amount, publicAddress) {
    return new Promise(function (fulfill, reject) { // Create Promise
       
     // TODO: Link this to our database of currencies
        if (currency != "USD") { 
            reject("Only USD supported");
            return false;
        } 
        
        exports.sendAsset("USD", "USD", process.env.COLU_PRIVATE_KEY, process.env.COLU_PUBLIC_ADDRESS, publicAddress, amount).then(function (result) {
            fufill(result);
        }).catch(function (err) {
            reject(err)
        });
        
    }); // End Promise
}; // End Functioin

//------------------------------------------------- MOVE / CONVERT ASSET --------------------------
// between bit coin addresss
// amount = amount in fiat currency
// all curecy will not be int, will be a float (2)

exports.moveAsset = function (fromCurrency, toCurrency, privateKey, fromAddress, toAddress, amount) {
    return new Promise(function (fulfill, reject) { // Create Promise
   
   // TODO: Link this to our database of currencies
        if (fromCurrency != "USD") { 
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
        
        var colu = new Colu(settings);
        colu.on('connect', function () {  //  Once connected perform function
            console.log("connected");
            colu.sendAsset(send, function (err, body) {
                if (err) {
                    reject(err);
                    return console.error(err);  // START DOING THIS TOO
                }
                fulfill(body);
            });
        }); // End Colu
        colu.init();  // Initialize Colu API
    }); // End promise
}; // End Function

//------------------------------------------------- END --------------------------


