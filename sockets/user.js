'use strict';

//-- MAKE TWILLIO AVAILABLE
var twillio = require('../helpers/twillio.js');
//-- MAKE MONGO
var mongo = require('../helpers/mongo.js');

//--- SMS CODE
exports.smsCode = function (socket, io, msg) {
    
    var phoneNumber = msg.countryCode + msg.phoneNumber
    var verificationCode = Math.floor(1000 + Math.random() * 9000)
    console.log(verificationCode);
    var message = "Your Freemit code is: " + verificationCode
    
    mongo.setSMS(phoneNumber, verificationCode)
        .then(function(data) {
            twillio.sendSMS(phoneNumber, message);
       });
};