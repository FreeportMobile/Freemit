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
   // WORKING privateSeed: 'abcd4986fdac1b3a710892ef6eaa708d619d67100d0514ab996582966f927982'
  privateSeed: '09357bde26559b424a1c50b7228aa7283b6d36d277e9b8d3d2f9a8f3fae20963'
}
var colu = new Colu(settings)
var asset = {
    amount: 500,
    metadata: {        
        'assetName': 'Chicago: The Musical',
        'issuer': 'AMBASSADOR THEATRE, 219 West 49th Street, New York, NY 10019',
        'description': 'Tickets to the show on 1/1/2016 at 8 PM'
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







