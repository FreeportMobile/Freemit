'use strict';

var bitcoin = require('bitcoinjs-lib');
var request = require('request');

//-------------------------- OP_RETURN MESSAGE SEND
// https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/test/integration/advanced.js#L24
// https://medium.com/@orweinberger/how-to-create-a-raw-transaction-using-bitcoinjs-lib-1347a502a3a#.wiwwofvsp
// https://bitcore.io/guides/i-made-this

// exports.sendMessage = function () {
//     return new Promise(function(resolve, reject) {    
//         console.log('SEND MSG 3a');

//         var privateKey = bitcoin.ECKey.fromWIF("KwFmrKDWXT6oNKQ9QosHTU3Vpp6EPT9ExVbq7n8Rq613ARsSr8vs");                                         
//         console.log(privateKey);
//         var publcAddress = (privateKey.pub.getAddress().toString()); 
//         console.log(publcAddress);
//         var tx = new bitcoin.TransactionBuilder();
//         // THIS IS THE LAST TRANSACTION ID WE NEED A WAY TO GET THIS FROM OUR OWN NODE OR ANOTHE API
//         tx.addInput('ea38d37772a3df4f546ffff5b471742d3d292255aac2bd11ceec9645c02e5a0a', 0);
//         // THIS THE PUBLIC ADDRESS TO SEND TO
//         tx.addOutput("1KAo4aY64FPYMsGdR3SQTXEcxPVqhjQG19", 1000); // 1000 satoshis will be taken as fee. 149000
//         tx.sign(0, privateKey);
//         console.log(tx.build().toHex());

//     }); //-- END PROMISE
// };// END FUNCTION

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
            "from": fromAddressArray,
            "fee": 5000,                                        
            "to": [{"address": toAddress, "amount": amount, "assetId": assetID }]
            // ,
            // 'metadata': {
            //     'assetId': '1',
            //     'assetName': 'Asset Name',
            //     'issuer': 'Asset Issuer',
            //     'description': 'My Description',
            //     'urls': [{name:'icon', url: 'https://pbs.twimg.com/profile_images/572390580823412736/uzfQSciL_bigger.png', mimeType: 'image/png', dataHash: ''}],
            //     'userData': {
            //         "meta' : [
            //             {key: 'Item ID', value: 2, type: 'Number'},
            //             {key: 'Item Name', value: 'Item Name', type: 'String'},
            //             {key: 'Company', value: 'My Company', type: 'String'},
            //             {key: 'Address', value: 'San Francisco, CA', type: 'String'}
            //         ]
            //     } // END USER DATA
            // } // END META DATA
        };
        console.log(send_asset);
        request.post({
            url: 'http://api.coloredcoins.org:80/v3/sendasset',
            headers: {'Content-Type': 'application/json'},
            form: send_asset
        }, 
        function (err, res, body) {
            console.log('-----BODY WITH TX HEX------');
            console.log(body);
            if (err) {
                console.log(body);
                console.log(err);
                reject(err);
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