'use strict';

//-- MAKE DEPENDANCIES AVAILABLE
require('dotenv').config();
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//-- MAKE STATIC FILES AVAILABLE
app.use(express.static('/public/www/'));

//-- SERVE INDEX FILE
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/www/index.html');
});

//--SOCKET EVENTS
exports.io = require('./sockets/events.js')(io);

//--START SERVER
server.listen(process.env.WEB_PORT, function () {
     console.info('--- STARTED ---');
});



