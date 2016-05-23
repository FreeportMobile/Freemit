'use strict';

//-- MAKE TWILLIO AVAILABLE
var twillio = require('../helpers/twillio.js');
//-- MAKE CRYPTO AVAILABLE
var crypto = require('../helpers/crypto.js');
//-- MAKE MONGO AVAILABLE
var mongo = require('../helpers/mongo.js');
//-- MAKE STRIPE AVAILABLE
var stripe = require('../helpers/stripe.js');
//-- MAKE BLOCKCHAIN AVAILABLE
var blockchain = require('../helpers/blockchain.js');
//-- MAKE BANK AVAILABLE
var bank =  require('./bank.js');


//----------------------------------------- SEND
exports.send = function (socket, io, msg) {

    // READ JWT  
    var encPhoneNumber = crypto.readJWT(msg.jwt).phone_number;
    var amount = 1;
    var toPhoneNumber = 234234;
        // FIND WHAT CURRENCY THEY NEED
            // CONVERT THE AMOUNT TO THE CURRENCY 
                // TRANSFR THE AMOUNT IN FROM CURENCY BACK TO HOT WALLET
                    // ISSUE NEW ASSET TO THE TO ADDRESS
    
    
    
    // // FIND LAST FOUR DIGITS FROM DEBIT CARD
    // mongo.getLastFour(encPhoneNumber)
    // .then(function(data) {        
    //     io.to(socket.id).emit('lastFour', {lastFour: data.last_four});
    // })
    // .catch(function(err) {
    // // some error
    // })
    
};// END FUNCTION

//----------------------------------------- LAST FOUR
exports.lastFour = function (socket, io, msg) {
    // READ JWT  
    var encPhoneNumber = crypto.readJWT(msg.jwt).phone_number;
    // FIND LAST FOUR DIGITS FROM DEBIT CARD
    mongo.getLastFour(encPhoneNumber)
    .then(function(data) {        
        io.to(socket.id).emit('lastFour', {lastFour: data.last_four});
    })
    .catch(function(err) {
    // some error
    })
    
};// END FUNCTION

//----------------------------------------- SAVE CONTACTS
exports.saveContacts = function (socket, io, msg) {
    console.log('SAVING CONACTS');
    // READ JWT  
    var encPhoneNumber = crypto.readJWT(msg.jwt).phone_number;
    // FIND COUNTRY THE USER IS IN
    mongo.getCountryCode(encPhoneNumber)
    .then(function(data) {  
        console.log('*******************'); 
        console.log(data);     
        console.log('*******************');
        var currencySymbol = data.currency_symbol;
        var currencyAbbreviation = data.currency_abbreviation;
        var countryCode = data.country_code;   
        var allContacts = msg.contacts;
        //LOOP OVER CONTACTS
        for (var i = 0; i < allContacts.length; i++) {
            console.log('ADD');
            // TODO: Review this assumption carefully!!!
            var name = allContacts[i].name;
            var phoneNumber = countryCode + allContacts[i].phoneNumber;
            var encPhoneNumber =crypto.encrypt(phoneNumber);
            exports.setoneContact(name, encPhoneNumber, countryCode);
        }
    })
    .catch(function(err) {
    // some error
    })
    
};// END FUNCTION

//------------------------------------------ SET ONE CONTACT

exports.setoneContact = function(name, encPhoneNumber, countryCode){
    console.log(name);
        blockchain.makeAddress()
        .then(function(data) {
            console.log(data);
            var bitcoinAddress = data.bitcoinAddress;
            var privateKey = data.privateKey;
            var encPrivateKey = crypto.encrypt(privateKey);
            mongo.setContacts(name, encPhoneNumber, countryCode, bitcoinAddress, encPrivateKey); 
        })
        .catch(function(err) {
        console.log(err);
        })
            
            // ENCRYPT EACH NUMBER WITH THE COUNTRY CODE                   
            // TODO: CHECK THE NUMBER DOESNT ALREADY HAVE A COUNTRY CODE (IMPORTANT)
            // TODO: MOVE THIS INTO MONGO (JUST OPEN 1 CONNECTION)  
};

//----------------------------------------- TOP UP
exports.topUp = function (socket, io, msg) {
    // READ THE JWT
    var encPhoneNumber = crypto.readJWT(msg.jwt).phone_number;
    // GET CARD DETAILS FROM MONGO
    mongo.getCard(encPhoneNumber)
        .then(function(data) {
            var value = msg.value;
            // DECRYPT THE CARD DTAILS AND PREPARE DATA FOR STRIPE
            var cardNumber = crypto.decrypt(data.card_number);
            var cardCVC = crypto.decrypt(data.card_CVC);
            var cardMonth = crypto.decrypt(data.card_month);
            var cardYear = crypto.decrypt(data.card_year);
            var currency = data.currency_abbreviation;
            // PREPARE TRANSFER PARTIES
            var fromAddress = process.env.BITCOIN_ADDRESS;
            var toAddress = data.bitcoin_address;
            // PREPARE ASSET TO TRANSFER
            var assetID = process.env.ASSET_USD
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
                        bank.add(data);
                        var amount = data.amount;
                        blockchain.transferAsset(amount, assetID, fromAddress, toAddress)
                    })
                    .catch(function(err) {
                    //  bank.error(data);
                    io.to(socket.id).emit('topup', {error: err.raw.message});
                    });      
        })
        .catch(function(err) {
            console.log(err) //TODO: Do somthing more meaningfull!
        });

};// END FUNCTION
//----------------------------------------- GET BALANCE
exports.getBalance = function (socket, io, msg) {
    // GET ENCRYPTED POHONE NUMBER FROM JWT
    var encPhoneNumber = crypto.readJWT(msg.jwt).phone_number;
    // GET BALANCE FROM MONGO
    mongo.getBalance(encPhoneNumber)
        .then(function(data) {
            var currencySymbol = data.currency_symbol;
            blockchain.queryAddress(data.bitcoin_address)
                .then(function(data) {
                    io.to(socket.id).emit('getBalance', {balance: data, currencySymbol: currencySymbol});
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
    var encPhoneNumber =crypto.encrypt(phoneNumber);
    var verificationCode = Math.floor(1000 + Math.random() * 9000);
    var message = "Your Freemit code is: " + verificationCode;
    var countryCode = msg.countryCode;
    var country = msg.country;
    var countryCode = msg.countryCode;
    var keySet = blockchain.makeAddress();
    
    mongo.getCurrency(countryCode)
        .then(function(data) {
            var currencySymbol = data.currency_symbol;
            var currencyAbbreviation = data.currency_abbreviation;
            blockchain.makeAddress()
            .then(function(data) {
                var publicKey = data.publicKey;
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
            console.log(err)
	        // TODO: Handle this error!
        });
}; // END FUNCTION
