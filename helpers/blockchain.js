'use strict';

var bitcoin = require('bitcoinjs-lib');
var request = require('request');

//------------------------- NEW BITCOIN ADDRESS -------------------------
exports.makeAddress = function () {
    console.log('making btc address');
    return new Promise(function(resolve, reject) {         
        var key = bitcoin.ECKey.makeRandom();
        var net = process.env.BITCOIN_NET;
        var address = key.pub.getAddress(bitcoin.networks.net).toString();
        var wif = key.toWIF();
        var keySet = {'bitcoinAddress':address, 'privateKey':wif};
        if(address && wif){
            resolve(keySet);
        }else{
            reject('Error');
        };
        
}); //-- END PROMISE
};// END FUNCTION

//------------------------- QUERY ADDRESS -------------------------
exports.queryAddress = function (bitcoinAddress) {
    return new Promise(function(resolve, reject) {
        request.get('http://api.coloredcoins.org:80/v3/addressinfo/'+bitcoinAddress, function (err, res, body) {
            if (err) {
                console.log(err);
                reject(err);
            }
            if (typeof body === 'string') {
                var obj = JSON.parse(body);
                var amount = 0;  
                for (var i = 0; i < obj.utxos.length; i++) { 
                    var amount = amount + obj.utxos[i].assets[0].amount
                }
            }
            resolve(amount/100);   
        });    
    }); //-- END PROMISE
};// END FUNCTION

//------------------------- TRANSFER AN ASSET ---------------------

exports.transferAsset = function (amount, assetID, fromAddress, toAddress) {
     return new Promise(function(resolve, reject) {

var fromAddressArray = [];
fromAddressArray.push(fromAddress);

        var send_asset = {
            'from': fromAddressArray,
            'fee': 5000,                                        
            'to': [{'address': toAddress, 'amount': amount, 'assetId': assetID }]
        };
        request.post({
            url: 'http://api.coloredcoins.org:80/v3/sendasset',
            headers: {'Content-Type': 'application/json'},
            form: send_asset
        }, 
        function (err, res, body) {
            if (err) {
                reject(err);
                console.log(err);
            }
            if (typeof body === 'string') {
                body = JSON.parse(body);
                var txHex = body.txHex;   
            }     
            var unsignedTx = txHex;
            var wif = process.env.BITCOIN_ADDRESS_KEY;
            var privateKey = bitcoin.ECKey.fromWIF(wif);
            console.log(unsignedTx);
            var tx = bitcoin.Transaction.fromHex(unsignedTx);
            var insLength = tx.ins.length;
            //-- START LOOP
            for (var i = 0; i < insLength; i++) {
                tx.sign(i, privateKey)
            } //-- END LOOP
            var signedTxHex = tx.toHex();
            var transaction = {'txHex': signedTxHex };
            // MAKE POST 2       
            request.post({
                url: 'http://api.coloredcoins.org:80/v3/broadcast',
                headers: {'Content-Type': 'application/json'},
                form: transaction
            }, 
            function (err, res, body) {
                if (err) {
                reject(err);
                }
                if (typeof body === 'string') {
                    body = JSON.parse(body)
                }
                resolve(body);   
            });
         
        });
    }); //-- END PROMISE
};// END FUNCTION