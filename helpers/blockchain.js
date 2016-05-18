'use strict';

var bitcoin = require('bitcoinjs-lib');
var request = require('request');

//------------------------- NEW BITCOIN ADDRESS -------------------------
exports.makeAddress = function () {
    return new Promise(function(resolve, reject) {         
        var key = bitcoin.ECKey.makeRandom();
        console.log(key);
        var net = process.env.BITCOIN_NET;
        console.log(net);
        var address = key.pub.getAddress(bitcoin.networks.net).toString();
        console.log(address);
        var wif = key.toWIF();
        console.log(wif);
        var keySet = {'bitcoinAddress':address, 'privateKey':wif};
        console.log(keySet);
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
                console.log("ERROR");
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
console.log('=== FROM ===');

var fromAddressArray = [];
fromAddressArray.push(fromAddress);
console.log(fromAddressArray);

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
              console.log('=== TRANSFER ASSET 1 ===');
            if (err) {
                   console.log('=== TRANSFER ASSET 2 ===');
                reject(err);
                console.log('=== TRANSFER ASSET ERROR ===');
                console.log(err);
            }
            if (typeof body === 'string') {
                   console.log('=== TRANSFER ASSET 3 ===');
                body = JSON.parse(body);
                 console.log('=== TRANSFER ASSET 4'+JSON.stringify(body));
                var txHex = body.txHex;   
                 console.log('=== TRANSFER ASSET 5'+body.txHex);
            }     
            var unsignedTx = txHex;
            var wif = process.env.BITCOIN_ADDRESS_KEY
            var privateKey = bitcoin.ECKey.fromWIF(wif)
            var tx = bitcoin.Transaction.fromHex(unsignedTx)
            var insLength = tx.ins.length
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