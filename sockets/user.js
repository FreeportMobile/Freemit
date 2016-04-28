'use strict';

//-- MAKE TWILLIO AVAILABLE
var twillio = require('../helpers/twillio.js');
//-- MAKE CRYPTO AVAILABLE
var crypto = require('../helpers/crypto.js');
//-- MAKE MONGO
var mongo = require('../helpers/mongo.js');

//--- SEND VERIFICATION CODE
exports.sendVerificationCode = function (socket, io, msg) {
    
    var phoneNumber = msg.countryCode + msg.phoneNumber;
    var encPhoneNumber =crypto.encrypt(phoneNumber);
    var verificationCode = Math.floor(1000 + Math.random() * 9000);
    var message = "Your Freemit code is: " + verificationCode;
    
    mongo.setSMS(encPhoneNumber, verificationCode)
       .then(function(data) {
            twillio.sendSMS(phoneNumber, message);
       })
       .then(function(data) {
           io.to(socket.id).emit('sendVerificationCode', {msg: 200});
       })
       .catch(function(err) {
           console.log(err)
	       // TODO: Handle this error!
        });
}; // END FUNCTION




//--- CHECK VERIFICATION CODE
exports.checkVerificationCode = function (socket, io, msg) {
    
    var verificationCode = msg.verificationCode;
    var phoneNumber = msg.countryCode + msg.phoneNumber;
    var encPhoneNumber =crypto.encrypt(phoneNumber);
    
    mongo.getVerification(encPhoneNumber, verificationCode)
        .then(function(data) {
            io.to(socket.id).emit('checkVerificationCode', {msg: 200});
            console.log('yes');
        }).catch(function(err) {
             console.log('no');
	        io.to(socket.id).emit('checkVerificationCode', {msg: 404});
        });
          
};// END FUNCTION