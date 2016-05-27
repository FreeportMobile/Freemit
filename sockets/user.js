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
//-- MAKE CLEAN AVAILABLE
var clean = require('../helpers/clean.js');


//----------------------------------------- SEND
exports.send = function (socket, io, msg) {
console.log(msg);
    // READ JWT  
    var encPhoneNumber = crypto.readJWT(msg.jwt).phone_number;
    var amount = 1;
    var toPhoneNumber = msg.phoneNumber;
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
    // READ JWT  
    var encPhoneNumber = crypto.readJWT(msg.jwt).phone_number;
    // FIND COUNTRY THE USER IS IN
    mongo.getCountryCode(encPhoneNumber)
    .then(function(data) {  
        var currencySymbol = data.currency_symbol;
        var currencyAbbreviation = data.currency_abbreviation;
        var countryCode = data.country_code;   
        var allContacts = msg.contacts;
        //LOOP OVER CONTACTS
        for (var i = 0; i < allContacts.length; i++) {
            // TODO: Review this assumption carefully!!!
            var name = allContacts[i].name;
            var sentNumber = allContacts[i].phoneNumber;
            var phoneNumber = clean.num(sentNumber);
            if (phoneNumber == undefined){
                var phoneNumber = clean.num(countryCode + sentNumber); 
            } 
            if(phoneNumber != undefined){
                var encPhoneNumber = crypto.encrypt(phoneNumber);
                exports.setOneContact(name, encPhoneNumber, countryCode);
            }
        }
    })
    .catch(function(err) {
    // some error
    })
    //TODO: SANITIZE ALL INPUTS TO STOP BAD ACTORS !!! VERY VERY IMPORTANT !!! 
};// END FUNCTION

//------------------------------------------ SET ONE CONTACT

exports.setOneContact = function(name, encPhoneNumber, countryCode){
    
    // DOES THE PHONE NUMBER ALREADY EXISTS?
    mongo.getOneUser(encPhoneNumber)
        .then(function(data) {
            if(data == null){
                // IF IT DOENST EXIST MAKE A BTC ADDRESS AND ADD IT
                blockchain.makeAddress()
                .then(function(data) {
                var bitcoinAddress = data.bitcoinAddress;
                var privateKey = data.privateKey;
                var encPrivateKey = crypto.encrypt(privateKey);
                mongo.setContacts(name, encPhoneNumber, countryCode, bitcoinAddress, encPrivateKey); 
                })
                .catch(function(err) {
                    console.log(err);
                })
            } else {
                return;
            }
        })
        .catch(function(err) {
            console.log(err);
        })
                    
            // TODO: MOVE THIS INTO MONGO (JUST OPEN 1 CONNECTION)  
};

//----------------------------------------- TOP UP
exports.topUp = function (socket, io, msg) {
    console.log(msg);
    // READ THE JWT
    var encPhoneNumber = crypto.readJWT(msg.jwt).phone_number;
    console.log(encPhoneNumber);
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
                console.log(cardNumber);
                console.log(cardCVC);
                console.log(cardMonth);
                console.log(cardYear);
                console.log(currency);
            // PREPARE TRANSFER PARTIES
            var fromAddress = process.env.BITCOIN_ADDRESS;
            var toAddress = data.bitcoin_address;
                console.log(fromAddress);
                console.log(toAddress);
            // PREPARE ASSET TO TRANSFER
            // TODO: Make an asset helper to retern these values
            console.log(currency);
            if (currency == 'USD'){
                var assetID = process.env.ASSET_USD
            }
            console.log(currency);
            if (currency == 'CNY'){
                console.log('-----CNY------');
                var assetID = process.env.ASSET_CNY
            }
            if (currency == 'INR'){
                var assetID = process.env.ASSET_INR
            }
            if (currency == 'EUR'){
                var assetID = process.env.ASSET_EUR
            }
                 console.log('----- ASSET ID------');
                console.log(assetID);
            // CREATE THE SOURCE FOR STRIPE
            var source = {exp_month:cardMonth, exp_year:cardYear, number:cardNumber,object:'card',cvc:cardCVC};
            var userID = data._id.toString()
            var timeNow = Date.now().toString()
            var description = 'Top Up: '+ value + ' ' + currency + ' - ' + userID;
            // CREATE META DATA FOR STRIPE
            var metadata = {id:userID, time:timeNow, value:value, currency:currency};
            console.log(userID);
             console.log(timeNow);
              console.log(value);
               console.log(currency);
            console.log(metadata);
            // DONT ALLOW USER TO DOUBLE CHARGE ACCIDENTLY 
            var idempotencyKey = msg.idempotencyKey;
            console.log(idempotencyKey);
            // SEND REQUEST TO STRIPE
                console.log(source);
                console.log(userID);
                console.log(timeNow);
                console.log(description);
            stripe.createCharge(value, currency, source, description, metadata, idempotencyKey)
                    .then(function(data) {
                        bank.add(data);
                        var amount = data.amount/100;
                        blockchain.transferAsset(amount, assetID, fromAddress, toAddress)
                    })
                    .catch(function(err) {
                    console.log(err);
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
            console.log(data);
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
    // GET UN THEN
    var verificationCode = msg.verificationCode;
    var phoneNumber = msg.countryCode + msg.phoneNumber;
    var encPhoneNumber = crypto.encrypt(phoneNumber);
        mongo.getOneUser(encPhoneNumber)
        .then(function(data) {
            var un = data.un;
            var jwt = crypto.makeJWT(encPhoneNumber, un);
            mongo.getVerification(encPhoneNumber, verificationCode)
                .then(function(data) {
                    io.to(socket.id).emit('checkVerificationCode', {result: true, jwt:jwt});
                }).catch(function(err) {
	                io.to(socket.id).emit('checkVerificationCode', {result: false});
                });
        })
        .catch(function(err) {
            console.log(err);
        })
};// END FUNCTION

//---------------------------------------- SEND VERIFICATION CODE

exports.sendVerificationCode = function (socket, io, msg) {
    var phoneNumber = clean.num(msg.countryCode + msg.phoneNumber);
    if (phoneNumber == ""){
        // REFLECT THIS TO THE APPLICATOIN SO THE USER CAN TRY AGAIN
        io.to(socket.id).emit('sendVerificationCode', {msg: 404}); 
        return; 
    }
    console.log(phoneNumber);
    var encPhoneNumber =crypto.encrypt(phoneNumber);
    var verificationCode = Math.floor(1000 + Math.random() * 9000);
    var message = "Your Freemit code is: " + verificationCode;
    var countryCode = msg.countryCode;
    var country = msg.country;
    var countryCode = msg.countryCode;
    var keySet = blockchain.makeAddress();
    // GET ALL THESE VALUES    
    Promise.all([
        mongo.getCurrency(countryCode),
        blockchain.makeAddress(),
        mongo.getOneUser(encPhoneNumber),
        ]) 
    .then(function(data){
        // IF ALL THE ABOVE RESOLVE
        var un = data[0].un; // THIS IS THE 3 LETTER COUNTRY ABREVIATOIN
        // TODO: SOLVE THE USA AND CANADA CONFUSION THEY HAVE THE SAME DIALING CODE
        var currencySymbol = data[0].currency_symbol;
        var currencyAbbreviation = data[0].currency_abbreviation;
        var bitcoinAddress = data[1].bitcoinAddress;
        var encPrivateKey = crypto.encrypt(data[1].privateKey);
        var usersExists = data[2];
        // IF THERES NO USER MAKE ONE WITH A BTC ADDRESS       
        if(usersExists == null){
            console.log('new user');
            mongo.setNewUser(encPhoneNumber, verificationCode, currencySymbol, currencyAbbreviation, country, countryCode, bitcoinAddress, encPrivateKey, un);  
        // IF THERE IS A USER ** DONT ** UPDATE WITH NEW BITCOIN ADDRESS  
        }else{
            console.log('contact updated');
            mongo.setKnownUser(encPhoneNumber, verificationCode, currencySymbol, currencyAbbreviation, country, countryCode, un);       
        }       
        twillio.sendSMS(phoneNumber, message); 
        io.to(socket.id).emit('sendVerificationCode', {msg: 200});   
    }).catch(function(err){
        // IF ANY OF THE ABOVE FAIL
        console.log("Fail!!");
        console.log(err);
    });
};// END FUNCTION
