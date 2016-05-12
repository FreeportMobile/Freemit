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
    
    
    
    
   
var settings = {
    coloredCoinsHost: 'https://testnet.api.coloredcoins.org',
    coluHost: 'https://testnet.engine.colu.co',
    network: 'testnet',
    privateSeed: '09357bde26559b424a1c50b7228aa7283b6d36d277e9b8d3d2f9a8f3fae20963'
}
var colu = new Colu(settings)

var assetId = 'La48eD69AVoYTBbpeX5XD8QKbFnZRwNw6KkcgP';
var fromAddress = '16iFLp6znGKxA5LrTPVVVmNbBDcQe7vKqz';
var toAddress = 'mhiwFNRAbDyyhQi1967qtxjqwiS9R8xuWs';

var send = {
    from: fromAddress,
    to: [{
        address: toAddress,
        assetId: assetId,
        amount: 1
    }],
    metadata: {        
        'assetName': '1 Ticket to see the Chicago Musical on 1/1/2016 at 8 PM',
        'issuer': 'Ticket booth on Times Square',
        'description': 'Seat 12 at row 10'
    }
};

colu.on('connect', function () {
    colu.sendAsset(send, function (err, body) {
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







