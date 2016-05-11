'use strict';

//-- MAKE TWILLIO AVAILABLE
var twillio = require('../helpers/twillio.js');
//-- MAKE CRYPTO AVAILABLE
var crypto = require('../helpers/crypto.js');
//-- MAKE MONGO AVAILABLE
var mongo = require('../helpers/mongo.js');
//-- MAKE STRIPE AVAILABLE
var stripe = require('../helpers/stripe.js');
//-- MAKE COLU AVAILABLE
var colu = require('../helpers/colu.js');

//----------------------------------------- SAVE CONTACTS
exports.saveContacts = function (socket, io, msg) {
    // READ JWT  
    var encPhoneNumber = crypto.readJWT(msg.jwt).phone_number;
    // FIND COUNTRY THE USER IS IN
    mongo.getCountryCode(encPhoneNumber)
    .then(function(data) {        
        var countryCode = data.country_code;   
        var allContacts = msg.contacts;
        //LOOP OVER CONTACTS
        for (var i = 0; i < allContacts.length; i++) {
            // ENCRYPT EACH NUMBER WITH THE COUNTRY CODE       
            var phoneNumber = countryCode + allContacts[i].phoneNumber;
            // TODO: CHECK THE NUMBER DOESNT ALREADY HAVE A COUNTRY CODE (IMPORTANT)
            // TODO: MOVE THIS INTO MONGO (JUST OPEN 1 CONNECTION)           
            var encPhoneNumber =crypto.encrypt(phoneNumber);
            // SEND EACH CONTACT TO MONGO
            mongo.setContacts(allContacts[i].name, encPhoneNumber, countryCode);  
        }
    })
    .catch(function(err) {
     // some error
    })
    
};// END FUNCTION

//----------------------------------------- TOP UP
exports.topUp = function (socket, io, msg) {
    // READ THE JWT
    var encPhoneNumber = crypto.readJWT(msg.jwt).phone_number;
    // GET CARD DETAILS FROM MONGO
    mongo.getCard(encPhoneNumber)
        .then(function(data) {
            if(cardNumber){
                var value = msg.value; // TODO: Change namr value to amount
                // DECRYPT THE CARD DTAILS AND PREPARE DATA FOR STRIPE
                var cardNumber = crypto.decrypt(data.card_number);
                var cardCVC = crypto.decrypt(data.card_CVC);
                var cardMonth = crypto.decrypt(data.card_month);
                var cardYear = crypto.decrypt(data.card_year);
                var currency = data.currency_abbreviation;
                var bitcoinAddress = data.bitcoin_address;
                // CREATE THE SOURCE FOR STRIPE
                var source = {exp_month:cardMonth, exp_year:cardYear, number:cardNumber,object:'card',cvc:cardCVC};
                var userID = data._id.toString()
                var timeNow = Date.now().toString()
                var description = 'Top Up: '+ value + ' ' + currency + ' - ' + userID;
                // CREATE META DATA FOR STRIPE
                var metadata = {id:userID, time:timeNow, value:value, currency:currency};
                // DONT ALLOW USER TO DOUBLE CHARGE ACCIDENTLY 
                var idempotencyKey = msg.idempotencyKey;
                // SEND REQUEST TO STRIPE
                stripe.createCharge(value, currency, source, description, metadata, idempotencyKey)
                        .then(function(data) {
                           colu.addAsset(currency, value, bitcoinAddress);
                     })
                        .catch(function(err) {
                            io.to(socket.id).emit('topup', {error: err.raw.message});
                        });                         
            } else {
                io.to(socket.id).emit('topup', {error: err.raw.message});
            }// END ELSE        
        }) // END THEN
        .catch(function(err) {
           console.log(err) //TODO: Do somthing more meaningfull!
        }); // END CATCH
};// END FUNCTION

//----------------------------------------- GET BALANCE
exports.getBalance = function (socket, io, msg) {
    
    // GET ENCRYPTED POHONE NUMBER FROM JWT
    var encPhoneNumber = crypto.readJWT(msg.jwt).phone_number;
    mongo.getBitcoinAddress(encPhoneNumber)
    .then(function(data) {
        colu.getAssets(data.bitcoin_address)
        .then(function(data) {
            io.to(socket.id).emit('getBalance', {balance: data.total, currencySymbol:data.currencyAbbreviation});            
        })
        .catch(function(err) {
            console.log(err) //TODO: Do somthing more meaningfull!
        });    
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


//---------------------------------------- SEND VERIFICATION CODE
exports.sendVerificationCode = function (socket, io, msg) {
    var phoneNumber = msg.countryCode + msg.phoneNumber;
    var encPhoneNumber = crypto.encrypt(phoneNumber);
    var verificationCode = Math.floor(1000 + Math.random() * 9000);
    var message = "Your Freemit code is: " + verificationCode;
    var countryCode = msg.countryCode;
    var country = msg.country;
    var countryCode = msg.countryCode;
    
     mongo.getCurrency(countryCode)
       .then(function(data) {
            var currencySymbol = data.currency_symbol;
            var currencyAbbreviation = data.currency_abbreviation;
            
            colu.makeAddress()
            .then(function(data) {
                var bitcoinAddress = data.bitcoinAddress;
                var privateKey = data.privateKey;
                var encPrivateKey = crypto.encrypt(privateKey);
                mongo.setSMS(encPhoneNumber, verificationCode, currencySymbol, currencyAbbreviation, country, countryCode, bitcoinAddress, encPrivateKey)
            })  
       })
       .then(function(data) {
           twillio.sendSMS(phoneNumber, message);
       })
       .then(function(data) {
           io.to(socket.id).emit('sendVerificationCode', {msg: 200});
       })
       .catch(function(err) {
           console.log(err);
	       // TODO: Handle this error!
        });
}; // END FUNCTION
