'use strict';

var bitcoin = require('bitcoinjs-lib');
var request = require('request');



//------------------------- NEW BITCOIN ADDRESS -------------------------
exports.makeAddress = function () {
     return new Promise(function(resolve, reject) {           
        var key = bitcoin.ECKey.makeRandom();
        var net = process.env.BITCOIN_NET;
        var address = key.pub.getAddress(bitcoin.networks.net).toString();
        var wif = key.toWIF();
        var keySet = {bitcoinAddress:bitcoinAddress, privateKey:privateKey};
          
        if(key && address && wif){
            resolve(keySet);
        }else{
            reject('Error');
        };
        
}); //-- END PROMISE
};// END FUNCTION

//------------------------- QUERY ADDRESS -------------------------
exports.queryAddress = function (bitcoinAddress) {
     return new Promise(function(resolve, reject) {
        request.get('http://testnet.api.coloredcoins.org:80/v3/addressinfo/'+bitcoinAddress, function (err, res, data) {
            
            if (err) {
                reject(err);
            }
            if (typeof body === 'string') {
                body = JSON.parse(body)
            }
            resolve(data);   
        });    
    }); //-- END PROMISE
};// END FUNCTION


//------------------------- TRANSFER AN ASSET ---------------------

exports.transferAsset = function (amount, assetID, fromAddress, toAddress) {
     return new Promise(function(resolve, reject) {

        var send_asset = {
            'from': [fromAddress],
            'fee': 5000,                                            
            'to': [{'address': toAddress, 'amount': amount, 'assetId': assetID }]
        };
        request.post({
            url: 'http://testnet.api.coloredcoins.org:80/v3/sendasset',
            headers: {'Content-Type': 'application/json'},
            form: send_asset
        }, 
        function (err, res, data) {
            if (err) {
                reject(err);
            }
            if (typeof body === 'string') {
                body = JSON.parse(body)
            }
            resolve(data);   
        });
    }); //-- END PROMISE
};// END FUNCTION