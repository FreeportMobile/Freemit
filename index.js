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
//-- DISABLE POWERED BY
app.disable('x-powered-by');


//------------------------- NEW ADDRESS ---------------------
app.get('/newAddress', function (req, res) {
    var key = bitcoin.ECKey.makeRandom();
    var address = key.pub.getAddress(bitcoin.networks.mainnet).toString();
    var wif = key.toWIF();
    res.status(200).json({ address: address, privateKey: wif });
});

//------------------------- ISSUE ASSET ---------------------
app.get('/issueAsset', function (req, res) {
    var asset = {
        issueAddress: 'mm3dtEPHfghf7P7AsCCnJGV3RS3dSJE9dN',
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
        url: 'http://mainnet.api.coloredcoins.org:80/v3/issue',
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
            url: 'http://mainnet.api.coloredcoins.org:80/v3/broadcast',
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
             res.status(response.statusCode).json(body);
            });
    });
});

//------------------------- TRANSFER AN ASSET ---------------------

app.get('/transferAsset', function (req, res) {

var send_asset = {
    'from': ['mm3dtEPHfghf7P7AsCCnJGV3RS3dSJE9dN'],		    // FROM
    'fee': 5000,                                            
    'to': [{
    	'address': 'mqH3a8RfQgNY61tjQtLdD4tss8Hex5yure',    // TO
    	'amount': 5,                                        // AMOUNT
    	'assetId': '90fbb3c719816ab0e50f24a2e2e196ffda75fd5ef762745699a205ebf60c908f'  // ASSET
    }]
};
    request.post({
        url: 'http://mainnet.api.coloredcoins.org:80/v3/sendasset',
        headers: {'Content-Type': 'application/json'},
        form: send_asset
    }, 
    function (error, response, body) {
        if (error) {
            res.status(200).json({error:"you no coin 3"});
        }
        if (typeof body === 'string') {
            body = JSON.parse(body)
        }
        res.status(response.statusCode).json(body);
    });
});

//------------------------- QUERY AN ADDRESS ---------------------

app.get('/transferAsset', function (req, res) {

        //address='mm3dtEPHfghf7P7AsCCnJGV3RS3dSJE9dN';
        request.get('http://testnet.api.coloredcoins.org:80/v3/addressinfo/'+address, function (error, response, body) {
            if (error) {
                res.status(200).json({error:"you no coin 4"});
            }
            if (typeof body === 'string') {
                body = JSON.parse(body)
            }
            res.status(response.statusCode).json(body);
        });

});


//------------------------- END ---------------------

//--SOCKET EVENTS
exports.io = require('./sockets/events.js')(io);

//--START SERVER

server.listen(process.env.WEB_PORT, function () {
    console.info('--- STARTED ---');
});
