'use strict';

//-- MAKE DEPENDANCIES AVAILABLE
require('dotenv').config();
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Colu = require('colu');

var colu = new Colu({
    network: 'testnet',
    privateSeed: '795bbe9bf4bcca6fbb51ae5293b6b55a9c424b02e9f05bf534114b3f4470e9d8'   
})



//-- MAKE STATIC FILES AVAILABLE
app.use(express.static('public/www'));

//-- SERVE INDEX FILE
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/www/index.html');
  
  
  var settings = {
      'from': fromAddress,
      'to':[{
          'address': address,
          'assetId': assetId,
          'amount': 1
      }]
  }
  
  colu.sendAsset(settings, function(err, res){
      if(err){
         console.log(err);
      }else{
          console.log(res);
      };
  }) // END COLU
  
});

//-- SERVE ASSETS FILE
app.get('/assets.txt', function (req, res) {
  res.sendFile(__dirname + '/public/www/assets.txt');
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
colu.on('connect', function () {
server.listen(process.env.WEB_PORT, function () {
     console.info('--- STARTED ---');
});
});



