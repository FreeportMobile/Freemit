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
app.use(express.static('public'));

//-- SERVE INDEX FILE
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/assets.txt');
  
  
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

//--SOCKET EVENTS
exports.io = require('./sockets/events.js')(io);

//--START SERVER
//colu.on('connect', function () {
server.listen(process.env.WEB_PORT, function () {
     console.info('--- STARTED ---');
});
//});



