'use strict';

module.exports = function (io) {

//-- CONNECT 
    io.on('connect', function (socket, msg) {
        
        console.log('SOCKET CONNECTED');
        
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
        
        socket.on('topup', function (msg) {
            rateLimiter(socket);
            freemit.user.topUp(socket, io, msg);
        });
        
        socket.on('saveContacts', function (msg) {
            rateLimiter(socket);
            freemit.user.saveContacts(socket, io, msg);
        });
             
//-- DISCONNECT
        socket.on('disconnect', function(socket) {
            console.log('--- DISCONECTED');
        });
        

    }); //-- END CONNECT
}; //-- END EXPORT

   function rateTracker(socket){
      // MAKE AN ARRAY FOR THIS USER IF WE DONT HAVE ONE ALREADY
            if (socket.lastActivity == undefined) {
                socket.lastActivity = [];
            }
     // DONT ALLOW THE ARRAY TO GET LONGER THAN 5
            if (socket.lastActivity.length > 5) {
                socket.lastActivity.shift();
            }
     // PUSH IN THE DATE TIME NOW AS A STRING
            socket.lastActivity.push(Date.now().toString());
        }

        function rateLimiter(socket){
            // CALL RATE TRACKER
            rateTracker(socket);
            // IF THE ARRAY IS NOT FULL, STOP HERE
            if (socket.lastActivity.length < 5){
               return;
            }
            // IF THE TIME NOW MINUS FIRST ITEM IN ARRAY IS LESS THAN 200ms DISCONNECT
            if(parseInt(Date.now()) - parseInt(socket.lastAcivity[0]) < 200){
            // DISCONNECT JUST THE ONE SOCKET THAT IS FLOODED
               socket.disconnect();
               console.log('--- SOCKET FLOODED');
               return;
            }
        }
