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

app.get('/address', function (req, res) {

var key = bitcoin.ECKey.makeRandom();
var address = key.pub.getAddress(bitcoin.networks.testnet).toString();
var wif = key.toWIF();
console.log('new TESTNET address: ['+address+']');
console.log('Private Key of new address (WIF format): ['+wif+']');

});



//--SOCKET EVENTS
exports.io = require('./sockets/events.js')(io);

//--START SERVER

    server.listen(process.env.WEB_PORT, function () {
        console.info('--- STARTED ---');
    });







