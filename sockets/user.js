'use strict';

//-- MAKE TWILLIO AVAILABLE
var twillio = require('../helpers/twillio.js');
//-- MAKE CRYPTO AVAILABLE
var crypto = require('../helpers/crypto.js');
//-- MAKE MONGO
var mongo = require('../helpers/mongo.js');


//----------------------------------------- ADD CARD
exports.getBalance = function (socket, io, msg) {
    
    // GET ENCRYPTED POHONE NUMBER FROM JWT
    var encPhoneNumber = crypto.readJWT(msg.jwt).phone_number;
    // GET BALANCE FROM MONGO
    mongo.getBalance(encPhoneNumber)
        .then(function(data) {
            if(!data.balance){
                io.to(socket.id).emit('getBalance', {balance:0, currencySymbol:data.currency_symbol});
            }else{
                io.to(socket.id).emit('getBalance', {balance: data.balance, currencySymbol:data.currency_symbol});
            }
            
        })
        .catch(function(err) {
           console.log(err) //TODO: Do somthing more meaningfull!
        });

};// END FUNCTION

//----------------------------------------- ADD CARD
exports.saveCard = function (socket, io, msg) {
    
    // GET ENCRYPTED POHONE NUMBER FROM JWT
    var encPhoneNumber = crypto.readJWT(msg.jwt).phone_number;
    // GET LAST 4 DIGITS OF CARD
    var cardNumber = msg.card_number;
    var lastFour = cardNumber.substr(cardNumber.length - 4);
    // ENCRYPT CARD NUMBER, EXPRIRATION AND CVC
    var encCardNumber = crypto.encrypt(cardNumber);
    var encCardCVC = crypto.encrypt(msg.card_cvc);
    var encCardMonth = crypto.encrypt(msg.card_month);
    var encCardYear = crypto.encrypt(msg.card_year);
    var encCardType = crypto.encrypt(msg.card_type);
    
    // SAVE TO MONGO
    mongo.setCard(encPhoneNumber, encCardNumber, encCardCVC, encCardMonth, encCardYear, lastFour, encCardType)
        .then(function(data) {
          io.to(socket.id).emit('saveCard', {msg: 200});
        })
        .catch(function(err) {
           console.log(err) //TODO: Do somthing more meaningfull!
        });
              
};// END FUNCTION


//---------------------------------------- SEND VERIFICATION CODE
exports.sendVerificationCode = function (socket, io, msg) {
    
    var phoneNumber = msg.countryCode + msg.phoneNumber;
    var encPhoneNumber =crypto.encrypt(phoneNumber);
    var verificationCode = Math.floor(1000 + Math.random() * 9000);
    var message = "Your Freemit code is: " + verificationCode;
    var countryCode = msg.countryCode;
    var country = msg.country;
    console.log(country);
    
     mongo.getCurrency(countryCode)
       .then(function(data) {
            var currencySymbol = data.currency_symbol;
            var currencyAbbreviation = data.currency_abbreviation;
            mongo.setSMS(encPhoneNumber, verificationCode, currencySymbol, currencyAbbreviation, country)
       })
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




//------------------------------------------ CHECK VERIFICATION CODE
exports.checkVerificationCode = function (socket, io, msg) {
    
    var verificationCode = msg.verificationCode;
    var phoneNumber = msg.countryCode + msg.phoneNumber;
    var encPhoneNumber =crypto.encrypt(phoneNumber);
    var jwt = crypto.makeJWT(encPhoneNumber);
    console.log(jwt);
    
    mongo.getVerification(encPhoneNumber, verificationCode)
        .then(function(data) {
            io.to(socket.id).emit('checkVerificationCode', {result: true, jwt:jwt});
        }).catch(function(err) {
	        io.to(socket.id).emit('checkVerificationCode', {result: false});
        });
          
};// END FUNCTION