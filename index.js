'use strict';

//-- MAKE DEPENDANCIES AVAILABLE
require('dotenv').config();
var Colu = require('colu')
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

app.get('/', function (req, res) {
    var privateSeed = colu.hdwallet.getPrivateSeed();
    var address = colu.hdwallet.getAddress();
    res.status(200).json({ 
        seed: privateSeed,
        address: address,
    });
});



//--SOCKET EVENTS
exports.io = require('./sockets/events.js')(io);

//--START SERVER
colu.on('connect', function () {
    server.listen(process.env.WEB_PORT, function () {
        console.info('--- STARTED ---');
    });
})
colu.init()





