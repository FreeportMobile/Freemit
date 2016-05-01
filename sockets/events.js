'use strict';

module.exports = function (io) {

//-- CONNECT 
    io.on('connect', function (socket, msg) {

//-- MAKE CONTROLLERS AVAILABLE
        var freemit = require('./freemit');

//-- SEND CONNECTED MESSAGE
        socket.emit('connected', { msg: "--- CONNECTED" })

//-- SOCKET EVENTS
        socket.on('sendVerificationCode', function (msg) {
            rateLimit(100);
            freemit.user.sendVerificationCode(socket, io, msg);
        });
        
        socket.on('checkVerificationCode', function (msg) {
            rateLimit(100);
            freemit.user.checkVerificationCode(socket, io, msg);
        });
        
        socket.on('saveCard', function (msg) {
            rateLimit(100);
            freemit.user.saveCard(socket, io, msg);
        });
        
        socket.on('getBalance', function (msg) {
            rateLimit(100);
            freemit.user.getBalance(socket, io, msg);
        });
        
        function rateLimit(max){
            if(Date.now() - socket.requested < max){
                socket.disconnect();
                return;
            }
        }
        socket.requested = Date.now();
        
//-- DISCONNECT
        socket.on('disconnect', function(socket) {
            console.log('--- DISCONECTED');
        });
        

    }); //-- END CONNECT
}; //-- END EXPORT
