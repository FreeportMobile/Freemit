'use strict';

//-- MAKE STRIPE AVAILABLE
var stripe = require('../helpers/stripe.js');
//-- MAKE MONGO
var mongo = require('../helpers/mongo.js');



//--- TOP UP
exports.add = function (data) {
    console.log('FIRED1');
  var transactionID = data.id;
  var status = data.status;
  var value = data.amount / 100;
  var currency = data.currency;
  var userID = data.metadata.id;
  var cardID = data.source.id;
  var fingerprint = data.source.fingerprint;
  var created = data.created

  if(status == 'succeeded'){
       mongo.setBankIn(transactionID, status, value, currency, userID, cardID, fingerprint, created);
  };




          
};// END FUNCTION


//--- WITHDRAW
exports.remove = function (data) {
    
    // WITHDRAW FUNDS TO USRS BANK 
          
};// END FUNCTION






