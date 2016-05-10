'use strict';

//-- MAKE DEPENDANCIES AVAILABLE
require('dotenv').config();
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//-- MAKE STATIC FILES AVAILABLE
app.use(express.static('public/www'));

//-- SERVE INDEX FILE
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/www/index.html');
});

//-- SERVE BALANCE FILE
app.get('/balance.html', function (req, res) {
  res.sendFile(__dirname + '/public/www/balance.html');
});


//-- SERVE CARD FILE
app.get('/card.html', function (req, res) {
  res.sendFile(__dirname + '/public/www/card.html');
});

//-- SERVE CHAT FILE
app.get('/chat.html', function (req, res) {
  res.sendFile(__dirname + '/public/www/chat.html');
});

//-- SERVE PAY FILE
app.get('/pay.html', function (req, res) {
  res.sendFile(__dirname + '/public/www/pay.html');
});

//-- SERVE SIGNUP FILE
app.get('/signup.html', function (req, res) {
  res.sendFile(__dirname + '/public/www/signup.html');
});

//-- SERVE TOPUP FILE
app.get('/topup.html', function (req, res) {
  res.sendFile(__dirname + '/public/www/topup.html');
});

//-- SERVE VERIFY FILE
app.get('/verify.html', function (req, res) {
  res.sendFile(__dirname + '/public/www/verify.html');
});

//--SOCKET EVENTS
exports.io = require('./sockets/events.js')(io);

//--START SERVER
server.listen(process.env.WEB_PORT, function () {
     console.info('--- STARTED ---');
});



