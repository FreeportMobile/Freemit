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
//--SOCKET EVENTS
exports.io = require('./sockets/events.js')(io);
//--START SERVER
server.listen(process.env.WEB_PORT, function () {
    console.info('--- STARTED ---');
});
