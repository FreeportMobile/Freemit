'use strict';

//-- MAKE TWILLIO AVAILABLE
var twillio = require('../helpers/twillio.js');
//-- MAKE MONGO
var mongo = require('../helpers/mongo.js');

//--- SMS CODE
exports.smsCode = function (socket, io, msg) {
    
    var phoneNumber = msg.countryCode + msg.phoneNumber
    var verificationCode = Math.floor(1000 + Math.random() * 9000)
    var message = "Your Freemit code is: " + verificationCode
    
    mongo.setSMS(phoneNumber, verificationCode)
        .then(function(data) {
       //     data.    //TODO: get some data or error back from mongo
                       //TODO: if error make a log
       });
    
      
    twillio.sendSMS(phoneNumber, message)
        .then(function(data) {
       //     data.    //TODO: get some data or error back from twillio
                       //TODO: if error tell the user the issue
       });


};