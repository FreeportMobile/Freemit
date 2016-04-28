'use strict';

//-- MAKE STRIPE AVAILABLE
var stripe = require('../helpers/stripe.js');
//-- MAKE CRYPTO AVAILABLE
var crypto = require('../helpers/crypto.js');
//-- MAKE MONGO
var mongo = require('../helpers/mongo.js');



//--- ADD CARD
exports.saveCard = function (socket, io, msg) {
    var stripeToken = msg.stripeToken;
    var description = 'TEST FIRST STRIPE ACCOUNT';
    var metaData = {jwt:msg.jwt};
    stripe.createCustomer(stripeToken, description, metaData)
          
};// END FUNCTION





//--- TOP UP
exports.topUp = function (socket, io, msg) {
    
    // ADD FUNDS TO USERS ACCOUNT
          
};// END FUNCTION


//--- WITHDRAW
exports.withdraw = function (socket, io, msg) {
    
    // WITHDRAW FUNDS TO USRS BANK 
          
};// END FUNCTION






