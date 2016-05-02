'use strict';

module.exports = function (io) {

//-- CONNECT 
    io.on('connect', function (socket, msg) {
       
//-- SET LAST ACTIVITY FOR RATE LIMITING        
       socket.lastAcivity = new Array(Date.now().toString());

//-- MAKE CONTROLLERS AVAILABLE
        var freemit = require('./freemit');

//-- SEND CONNECTED MESSAGE
        socket.emit('connected', { msg: "--- CONNECTED" })

//-- SOCKET EVENTS
        socket.on('sendVerificationCode', function (msg) {
            rateLimiter(socket);
            freemit.user.sendVerificationCode(socket, io, msg);
        });
        
        socket.on('checkVerificationCode', function (msg) {
            rateLimiter(socket);
            freemit.user.checkVerificationCode(socket, io, msg);
        });
        
        socket.on('saveCard', function (msg) {
            rateLimiter(socket);
            freemit.user.saveCard(socket, io, msg);
        });
        
        socket.on('getBalance', function (msg) {
            rateLimiter(socket);
            freemit.user.getBalance(socket, io, msg);
        });
        

        
//-- DISCONNECT
        socket.on('disconnect', function(socket) {
            console.log('--- DISCONECTED');
        });
        

    }); //-- END CONNECT
}; //-- END EXPORT

   function rateTracker(socket){
      // MAKE AN ARRAY THAT IS NOT UNDEFINED
            if (socket.lastActivity == undefined) {
                socket.lastActivity = [];
            }
     // DONT ALLOW THE ARRAY TO GET LONGER THAN 5
            if (socket.lastActivity.length > 5) {
                socket.lastActivity.shift();
            }
     // PUSH IN THE DATE TIME NOW
            socket.lastActivity.push(Date.now().toString());
        }

        function rateLimiter(socket){
            // CALL RATE TRACKER
            rateTracker(socket);
            // MAKE SURE THE ARRAY IS FULL
            if (socket.lastActivity.length < 5){
               return;
            }
            // OF THE TIME NOW MINUS FIRST ITEM IN ARRAY IS LESS THAN 200ms DISCONNECT
            if(parseInt(Date.now()) -parseInt(socket.lastAcivity[0]) < 200){
            // DISCONNECT JUST THE SOCKET THAT IS FLOODED
               socket.disconnect();
               console.log('--- DISCONNECTD - SOCKET FLOODED');
               return;
            }
        }
