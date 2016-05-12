'use strict';

//-- MAKE DEPENDANCIES AVAILABLE
require('dotenv').config();
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);



//-- MAKE STATIC FILES AVAILABLE
app.use(express.static(__dirname + '/public')); 

app.get('/', function (req, res) {
    res.status(200).json({ error: 'freemit' });
});



//--SOCKET EVENTS
exports.io = require('./sockets/events.js')(io);

//--START SERVER

server.listen(process.env.WEB_PORT, function () {
     console.info('--- STARTED ---');
});




