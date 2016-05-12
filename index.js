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
    
    
    
    
  var Colu = require('colu')
var settings = {
    coloredCoinsHost: 'https://testnet.api.coloredcoins.org',
    coluHost: 'https://testnet.engine.colu.co',
    network: 'testnet',
  privateSeed: '09357bde26559b424a1c50b7228aa7283b6d36d277e9b8d3d2f9a8f3fae20963'
}
var colu = new Colu(settings)
var asset = {
    amount: 500,
    metadata: {        
        'assetName': 'WillCoin',
        'issuer': 'Will',
        'description': 'WillCoin'
    }
}

colu.on('connect', function () {
    colu.issueAsset(asset, function (err, body) {
        if (err) return console.error(err)        
        console.log("Body: ",body)
    })
})

colu.init()
    

});

//--SOCKET EVENTS
exports.io = require('./sockets/events.js')(io);

//--START SERVER

    server.listen(process.env.WEB_PORT, function () {
        console.info('--- STARTED ---');
    });







