'use strict';

//-- MAKE DEPENDANCIES AVAILABLE
require('dotenv').config();
var bitcoin = require('bitcoinjs-lib');
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

    postToApi('issue', asset, function(err, body){
        if (err) {
            console.log('error: ', err);
        }
    });
    
});


//------------------------- SHARED FUNCTIONS ---------------------

function postToApi(api_endpoint, json_data, callback) {
    console.log(api_endpoint+': ', JSON.stringify(json_data));
    request.post({
        url: 'http://testnet.api.coloredcoins.org:80/v3/'+api_endpoint,
        headers: {'Content-Type': 'application/json'},
        form: json_data
    }, 
    function (error, response, body) {
        if (error) {
            return callback(error);
        }
        if (typeof body === 'string') {
            body = JSON.parse(body)
        }
        res.status(response.statusCode).json({ body: JSON.stringify(body) });
        return callback(null, body);
    });
};







//--SOCKET EVENTS
exports.io = require('./sockets/events.js')(io);

//--START SERVER

    server.listen(process.env.WEB_PORT, function () {
        console.info('--- STARTED ---');
    });







