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
    var funded_address = 'mm3dtEPHfghf7P7AsCCnJGV3RS3dSJE9dN';
    var asset = {
        issueAddress: funded_address,
        amount: 1000,
        fee: 5000,     
        metadata: {
            "assetName": "Freemit USD",
            "description": "The Freemit USD",
            "userData": {
            "meta": [{
                "key": "Our website",
                "value": "https://dev.freemot.tech",
                "type": "URL",
                "required": false
            }, {
                "key": "Coin value",
                "value": "1coin=1USD",
                "type": "String",
                "required": false
            }]
            },
            "urls": [{
                "name": "icon",
                "url": "https://s3-us-west-2.amazonaws.com/colu-website/izyefJ5cTo2_Vb57PwHtfsIL.png",
                "dataHash": "c3f149bf01869716ed213d23cee4f43faf34f768e994057ffe9893a93b4dc7db",
                "mimeType": "image/png"
            }],
            "issuer": "Freemit"
        }
    };
    // MAKE POST 1   
    request.post({
        url: 'http://testnet.api.coloredcoins.org:80/v3/issue',
        headers: {'Content-Type': 'application/json'},
        form: asset
    }, 
    function (error, response, body) {
        if (error) {
            res.status(200).json({error:"you no coin 1"});
        }
        var txHex = body.txHex;
        if (typeof body === 'string') {
            body = JSON.parse(body);
            var txHex = body.txHex;
        }
        var unsignedTx = txHex;
        var wif = 'KyBSb689eBfT9myFR78DtR7cSmFC3Jx4CwPzuX5hA5Nsang8DAjn'
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
            url: 'http://testnet.api.coloredcoins.org:80/v3/broadcast',
            headers: {'Content-Type': 'application/json'},
            form: transaction
        }, 
        function (error, response, body) {
            if (error) {
                res.status(200).json({error:"you no coin 2"});
            }
            if (typeof body === 'string') {
                body = JSON.parse(body)
            }
             res.status(response.statusCode).json(body.txid);
            });
    });
});

//------------------------- TRANSFER AN ASSET ---------------------
app.get('/transferAsset', function (req, res) {

funded_address = 'mm3dtEPHfghf7P7AsCCnJGV3RS3dSJE9dN'; 

    var asset = {
        'issueAddress': funded_address,
        'amount': 100,
        'fee': 5000
    };

    request.post({
        url: 'http://testnet.api.coloredcoins.org:80/v3/issue',
        headers: {'Content-Type': 'application/json'},
        form: asset
    }, 
    function (error, response, body) {
        if (error) {
            res.status(200).json({error:"you no coin 1"});
        }
        if (typeof body === 'string') {
            body = JSON.parse(body)
        }
        res.status(response.statusCode).json(body.txid);

    });

});

//------------------------- TRANSFER AN ASSET ---------------------







//--SOCKET EVENTS
exports.io = require('./sockets/events.js')(io);

//--START SERVER

    server.listen(process.env.WEB_PORT, function () {
        console.info('--- STARTED ---');
    });







