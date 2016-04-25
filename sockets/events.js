'use strict';

module.exports = function (io) {

//-- CONNECT 
    io.on('connect', function (socket, msg) {

//-- MAKE CONTROLLERS AVAILABLE
        var freemit = require('./freemit');

//-- SEND CONNECTED MESSAGE
        socket.emit('connected', { msg: "--- CONNECTED" })

//-- SOCKET EVENTS
        socket.on('mobilelogin', function (msg) {
            freemit.user.smsCode(socket, io, msg);
        });
        
        socket.on('addbank', function (msg) {
            freemit.bank.add(socket, io, msg);
        });
        
        socket.on('addexchange', function (msg) {
            freemit.exchange.add(socket, io, msg);
        });
        
//-- DISCONNECT
        socket.on('disconnect', function(socket) {
            console.log('--- DISCONECTED');
        });
        

    }); //-- END CONNECT
}; //-- END EXPORT
