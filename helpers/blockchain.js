'use strict';

var bitcoin = require('bitcoinjs-lib');
var request = require('request');
var blockchain = require('blockchain.info');
var blockexplorer = require('blockchain.info/blockexplorer');

//------------------------- NEW OP_RETURN TRANSACTION -------------------------
exports.opReturn = function (message, fromKey) {
    return new Promise(function(resolve, reject) {    

        var network = bitcoin.networks.mainnet;
        var keyPair = bitcoin.ECPair.fromWIF(fromKey);
        var address = keyPair.getAddress();


        var url = 'https://blockchain.info/id/unspent?active='+address;
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var body = JSON.parse(body);
                var tx = new bitcoin.TransactionBuilder(network);
                var data = new Buffer(message);
                var dataScript = bitcoin.script.nullDataOutput(data);
                //var unspent = body.unspent_outputs[0].tx_hash;
                var unspent = body.unspent_outputs[1].tx_hash_big_endian;
                var unspent = body.unspent_outputs[2].tx_hash_big_endian;
                tx.addInput(unspent, 0);
                tx.addOutput(dataScript, 0);
                tx.addOutput(address, 1000);
                tx.addOutput('1KAo4aY64FPYMsGdR3SQTXEcxPVqhjQG19', 1000);
                tx.sign(0, keyPair);
                var txRaw = tx.build();
                var txId = txRaw.getId()
                var hex = txRaw.toHex();
                console.log('--txId--');
                console.log(txId);
                console.log('--hex--');
                console.log(hex);
                request.post('http://btc.blockr.io/api/v1/tx/push').form({hex:hex});
                resolve(hex);
            } else{
                reject(error);
            };
        })

    }); //-- END PROMISE
};// END FUNCTION

//------------------------- NEW BITCOIN TRANSACTION -------------------------
exports.makeTransaction = function () {
    return new Promise(function(resolve, reject) {    
        var keyPair = bitcoin.ECPair.fromWIF('L1uyy5qTuGrVXrmrsvHWHgVzW9kKdrp27wBC7Vs6nZDTF2BRUVwy')
        var tx = new bitcoin.TransactionBuilder()
            tx.addInput('aa94ab02c182214f090e99a0d57021caffd0f195a81c24602b1028b130b63e31', 0)
            tx.addOutput('1Gokm82v6DmtwKEB8AiVhm82hyFSsEvBDK', 15000)
            tx.sign(0, keyPair)
        var finalTX = tx.build().toHex();
        if(finalTX){
            resolve(finalTX);
        }else{
            reject('Error');
        };
    }); //-- END PROMISE
};// END FUNCTION

//------------------------- NEW BITCOIN ADDRESS -------------------------
exports.makeAddress = function () {
    return new Promise(function(resolve, reject) {     
        function rng () { return new Buffer('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz') }
        var keyPair = bitcoin.ECPair.makeRandom({ rng: rng })
        var address = keyPair.getAddress()
        var wif = keyPair.toWIF()
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
  console.log('----- FIRED------');
        var send_asset = {
            "from": fromAddressArray,
            "fee": 22000,                                        
            "to": [{"address": toAddress, "amount": amount, "assetId": assetID }]
        };
        
        console.log('----- SEND ASSET START------');
        console.log(send_asset);
        console.log('----- SEND ASSET END------');
        request.post({
            url: 'http://api.coloredcoins.org:80/v3/sendasset',
            headers: {'Content-Type': 'application/json'},
            form: send_asset
        }, 
        function (err, res, body) {
            if (err) {
                console.log('----- ERROR 1 START------');
                console.log(err);
                console.log('----- ERROR 1 END------');
                reject(err);
            }
            if (typeof body === 'string') {
                body = JSON.parse(body);
                console.log('----- BODY START------');
                console.log(body);
                console.log('----- BODY END------');
                if(body.error.length > 1){
                    reject(body.error);
                    return;
                };
                var txHex = body.txHex;   
            }     
            var unsignedTx = txHex;
            var wif = process.env.BITCOIN_ADDRESS_KEY;
            var privateKey = bitcoin.ECKey.fromWIF(wif);

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
