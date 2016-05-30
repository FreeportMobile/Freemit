'use strict';

var bitcoin = require('bitcoinjs-lib');
var request = require('request');

//-------------------------- OP_RETURN MESSAGE SEND
// https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/test/integration/advanced.js#L24

exports.sendMessage = function () {
    return new Promise(function(resolve, reject) {    
        console.log('SEND MSG 3a');

        var privateKey = bitcoin.ECKey.fromWIF("KwFmrKDWXT6oNKQ9QosHTU3Vpp6EPT9ExVbq7n8Rq613ARsSr8vs");                                         
        console.log(privateKey);
        var publcAddress = (privateKey.pub.getAddress().toString()); 
        console.log(publcAddress);
        // var net = process.env.BITCOIN_NET;  
        // var keyPair = bitcoin.ECPair.fromWIF('KwFmrKDWXT6oNKQ9QosHTU3Vpp6EPT9ExVbq7n8Rq613ARsSr8vs', net);
        // var address = keyPair.getAddress();
        // console.log(address);
        
        // var net = process.env.BITCOIN_NET;
        // var keyPair = bitcoin.ECPair.fromWIF('KwFmrKDWXT6oNKQ9QosHTU3Vpp6EPT9ExVbq7n8Rq613ARsSr8vs');
        // var privateKey = keyPair.d.toBuffer(32)
        // console.log(keyPair);
        
        // var fromAddress =   '16WBguy6KVyTGnF4KX7Vmdx8ztj4wENh4W';
        // var toAddress =     '1KAo4aY64FPYMsGdR3SQTXEcxPVqhjQG19';
        // var message =       'Blockchain Chat';
        
        
        // var tx = new bitcoin.TransactionBuilder();
        // tx.addInput(fromAddress, 0)
        // tx.addOutput(toAddress, 1000)
        // tx.sign(0, keyPair);
        // console.log(tx.build().toHex());
        
        
        
        
        
        
        
        
        //var keyPair = bitcoin.ECPair.fromWIF('KwFmrKDWXT6oNKQ9QosHTU3Vpp6EPT9ExVbq7n8Rq613ARsSr8vs');
        
        //console.log(keyPair);
        //var tx = new bitcoin.TransactionBuilder()
        
        // tx.addInput('aa94ab02c182214f090e99a0d57021caffd0f195a81c24602b1028b130b63e31', 0)
        // tx.addOutput('1Gokm82v6DmtwKEB8AiVhm82hyFSsEvBDK', 15000)
        // tx.sign(0, keyPair)
        
        
        
        // console.log(wif);
        // var privateKey = bitcoin.ECKey.fromWIF(wif);
        // var fromAddress = privateKey.pub.getAddress().toString();
        // var tx = new bitcoin.TransactionBuilder();
        // tx.addInput(fromAddress, 0);
        // tx.addOutput("12idKQBikRgRuZEbtxXQ4WFYB7Wa3hZzhT", 1000); // 1000 satoshis will be taken as fee.
        // tx.sign(0, privateKey);
        // console.log(tx.build().toHex());
        
        // var message = "Blockchain Chat"
        // var network = bitcoin.networks.testnet;
        // console.log(network);
        // var keyPair = bitcoin.ECPair.makeRandom({ network: network });
        // console.log(keyPair);
        // var address = keyPair.getAddress();
        // console.log(address);
        // var tx = new bitcoin.TransactionBuilder(network);
        // console.log(tx);
        // var data = new Buffer(message);
        // console.log(data);
        
        
        // blockchain.t.faucet(address, 2e4, function (err, unspent) {
        //     if (err) return done(err)
        //     var tx = new bitcoin.TransactionBuilder(network)
        //     var data = new Buffer(message)
        //     var dataScript = bitcoin.script.nullDataOutput(data)
        //     tx.addInput(unspent.txId, unspent.vout)
        //     tx.addOutput(dataScript, 1000)
        //     tx.sign(0, keyPair)
        //     var txRaw = tx.build()
        //     blockchain.t.transactions.propagate(txRaw.toHex(), done)
            
        //    // push transaction to bockchain
        //     //http://btc.blockr.io/api/v1/tx/push
            
        // })
    }); //-- END PROMISE
};// END FUNCTION

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

console.log('-----SNEDING------');
console.log(toAddress);
console.log(amount);
console.log(assetID);



        var send_asset = {
            'from': fromAddressArray,
            'fee': 6000,                                        
            'to': [{'address': toAddress, 'amount': amount, 'assetId': assetID }]
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