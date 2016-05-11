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

//------------------------------------------------- GET ASSETS BALANCES --------------------------

exports.getAssets = function (bitcoinAddress) {  // Get Balance of Public Bitcoin Address
    return new Promise(function (fulfill, reject) { // Create Promise
           
        var settings = {
	        "network": "mainnet",
	        "privateSeed": process.env.COLU_PRIVATE_SEED,
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

exports.addAsset = function (currency, amount, bitcoinAddress) {
    console.log('---------- ADD ASSET ------------');
    return new Promise(function (fulfill, reject) { // Create Promise
       
     // TODO: Link this to our database of currencies
        if (currency != "USD") { 
            reject("Only USD supported");
            return false;
        } 
        
        exports.moveAsset("USD", "USD", process.env.COLU_PRIVATE_SEED, process.env.COLU_PUBLIC_ADDRESS, bitcoinAddress, amount).then(function (result) {
            fulfill(result);
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
   
   
   
   var privateSeed = null
var assetId;
var settings = {
	"network": "mainnet",
	"privateSeed":"263da4c2186abcfd6b429258842c1224d0c6a354e780212fcc78aca4efcf85aa",
	"apiKey": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0aWQiOiI1NzJiZmViYTNkNmU0Yzc0NzY3YTgyMTMiLCJleHAiOjE0NjYxMDEwNTA5MDV9.GGeq-t8nGshBG0DCj1mKytDk2DGjHE72XOZgK-XT_x8"
}
//Edit the JSON freely but don't delete this comment or add code before it 

var colu = new Colu(settings)
colu.on('connect', function () {
	var args = 	{
	"from": ["1NVXG5252Lq44QYwokZVjhKVg2K1aZ9fcb"],
	"to": [{
		"address": "1KCZDRbwhpBh55NPf9mVUQyyCbLzMXopXG",
		"phoneNumber": "+1234567890",
		"assetId": "LaA3rWco7TGJugdQdF7xFSQgTrPogThxBeTBrt",
		"amount": "1"
	}],
	"metadata": {
		"assetName": "Mission Impossible 15",
		"issuer": "Fox Theater",
		"description": "Movie ticket to see the New Tom Cruise flick"
	}
}
	//Edit the JSON freely but don't delete this comment or add code before it 

	colu.sendAsset(args, function (err, body) {
		if (err) {
console.log(err);
			return;
		}
console.log(body);
	});
});

colu.init();


   
   
//    // TODO: Link this to our database of currencies
//         if (fromCurrency != "USD") { 
//             reject("Only USD supported");
//             return false;
//         }
        
//         var send = {
//             from: [fromAddress],
//             to: [{
//                 address: toAddress,
//                 assetId: process.env.COLU_USD,
//                 amount: amount
//             }]
//         };
        
//         var privateSeed = null
//         var assetId;
//         var settings = {
// 	        "network": "mainnet",
// 	        "privateSeed":process.env.COLU_PRIVATE_SEED,
// 	        "apiKey": process.env.COLU_APIKEY
// }


//         var colu2 = new Colu(settings);
        
//         colu2.on('connect', function () {  //  Once connected perform function
//             colu2.sendAsset(send, function (err, body) {
                
//                 if (err) {
//                     reject(err);
//                     return console.error(err);  // START DOING THIS TOO
//                 }
//                 console.log(body);
//                 fulfill(body);
//             });
//         }); // End Colu
//         colu2.init();  // Initialize Colu API
    }); // End promise
}; // End Function

//------------------------------------------------- END --------------------------


