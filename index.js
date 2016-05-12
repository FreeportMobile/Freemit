'use strict';

//-- MAKE DEPENDANCIES AVAILABLE
require('dotenv').config();
var bitcoin = require('bitcoinjs-lib');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


var colu = new Colu({
    network: 'testnet',
    privateSeed: null
})

//-- MAKE STATIC FILES AVAILABLE
app.use(express.static(__dirname + '/public')); 

app.get('/verify', function (req, res) {
    key = bitcoin.ECKey.makeRandom();
    address = key.pub.getAddress().toString();
    console.log('new bitcoin address: ['+address+']');
});

//--SOCKET EVENTS
exports.io = require('./sockets/events.js')(io);

//--START SERVER

    server.listen(process.env.WEB_PORT, function () {
        console.info('--- STARTED ---');
    });







