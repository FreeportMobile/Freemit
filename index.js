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
        },{
            phoneNumber: phoneNumber,
            assetId: assetId,
            amount: 2
        }],
        metadata: {
            'assetName': 'Mission Impossible 16',
            'issuer': 'Fox Theater',
            'description': 'Movie ticket to see the New Tom Cruise flick again',
            'urls': [{name:'icon', url: 'https://pbs.twimg.com/profile_images/572390580823412736/uzfQSciL_bigger.png', mimeType: 'image/png', dataHash: ''}],
            'userData': {
                'meta' : [
                    {key: 'Item ID', value: 2, type: 'Number'},
                    {key: 'Item Name', value: 'Item Name', type: 'String'},
                    {key: 'Company', value: 'My Company', type: 'String'},
                    {key: 'Address', value: 'San Francisco, CA', type: 'String'}
                ]
            }
        }
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





