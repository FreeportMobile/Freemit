'use strict';

//-- MAKE DEPENDANCIES AVAILABLE
require('dotenv').config();
var bitcoin = require('bitcoinjs-lib');
var request = require('request');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//-- MAKE STATIC FILES AVAILABLE
app.use(express.static(__dirname + '/public')); 


//------------------------- NEW ADDRESS ---------------------
app.get('/newAddress', function (req, res) {
    var key = bitcoin.ECKey.makeRandom();
    var address = key.pub.getAddress(bitcoin.networks.testnet).toString();
    var wif = key.toWIF();
    res.status(200).json({ address: address, privateKey: wif });
});


//------------------------- ISSUE ASSET ---------------------
app.get('/issueAsset', function (req, res) {
    var funded_address = 'mm3dtEPHfghf7P7AsCCnJGV3RS3dSJE9dN'
    var asset = {
        'issueAddress': funded_address,
        'amount': 1,
        'fee': 5000
    };
       
    request.post({
        url: 'http://testnet.api.coloredcoins.org:80/v3/issue',
        headers: {'Content-Type': 'application/json'},
        form: asset
    }, 
    function (error, response, body) {
        if (error) {
            return callback(error);
        }
        var txHex = body.txHex;
        res.status(200).json({ txHex: JSON.stringify(txHex) });
 
    });

});


//------------------------- SIGN TRANSACTION ---------------------

app.get('/issueAsset', function (req, res) {

    function signTx (unsignedTx, wif) {
        var wif = 'KyBSb689eBfT9myFR78DtR7cSmFC3Jx4CwPzuX5hA5Nsang8DAjn'
        var privateKey = bitcoin.ECKey.fromWIF(wif)
        var tx = bitcoin.Transaction.fromHex(unsignedTx)
        var insLength = tx.ins.length
        for (var i = 0; i < insLength; i++) {
            tx.sign(i, privateKey)
        }
        return tx.toHex()
    }
    
    
    var key = 'wif format of private key of your issuance address'
// e.g. var key = 'KzH9zdXm95Xv3z7oNxzM6HqSPUiQbuyKoFdQBTf3HKx1B6eYdbAn';
var txHex = 'body.txHex response to issue';
// e.g. txHex = '0100000001e0cd69ce93aded7a8d51063ed5f7bb5c9cdcc885a93fa629574dedb2cd5b48ad0100000000ffffffff020000000000000000086a06434301050110b8820100000000001976a914ea55c2430dca31e56ef5ae55c2863dae65df908688ac00000000'


var signedTxHex = signTx(txHex, key);
console.log("signedTxHex: ["+signedTxHex+"]");
    
    
});


//--SOCKET EVENTS
exports.io = require('./sockets/events.js')(io);

//--START SERVER

    server.listen(process.env.WEB_PORT, function () {
        console.info('--- STARTED ---');
    });







