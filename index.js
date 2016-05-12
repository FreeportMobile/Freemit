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
    
    var privateSeed = '09357bde26559b424a1c50b7228aa7283b6d36d277e9b8d3d2f9a8f3fae20963'
    var assetId = 'La48eD69AVoYTBbpeX5XD8QKbFnZRwNw6KkcgP'
    var fromAddress = '16iFLp6znGKxA5LrTPVVVmNbBDcQe7vKqz'
    var phoneNumber = '+8618606863388'
    
    var privateSeed = colu.hdwallet.getPrivateSeed();
    var address = colu.hdwallet.getAddress();
    var toAddress = colu.hdwallet.getAddress();
    
    
       var args = {
        from: [fromAddress],
        to: [{
            address: toAddress,
            assetId: assetId,
            amount: 2
            }]
        }
    
    colu.sendAsset(args, function (err, body) {
        if (err){
            res.status(404).json({ 
                error: err,
            });
        }else{
            res.status(200).json({ 
                seed: privateSeed,
                address: address,
                toAddress: toAddress,
                body: body,
            }); 
        }
    })
    
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





