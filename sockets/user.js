'use strict';

//-- MAKE TWILLIO AVAILABLE
var twillio = require('../helpers/twillio.js');


//--- SMS CODE
exports.smsCode = function (socket, io, msg) {
    
    var phoneNumber = msg.countryCode + msg.phoneNumber
    var message = "Your Freemit code is: "+Math.floor(1000 + Math.random() * 9000)
    // TODO: Save number to mongo here!
      
    twillio.sendSMS(phoneNumber, message)
        .then(function(data) {
       //     data.    //TODO: get some data back from twillio
       });


};