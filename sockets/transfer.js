'use strict';

//-- MAKE STRIPE AVAILABLE
var colu = require('../helpers/colu.js');
//-- MAKE MONGO
var mongo = require('../helpers/mongo.js');
var crypto = require('../helpers/crypto.js');

//------------------------- TRANSFER TO WALLET-------------------------
exports.toWallet = function (fromPhone, toPhone, currency, amount) {
    return new Promise(function(resolve, reject) {   
        var fromPhone = fromPhone; 
        var toPhone = toPhone;
        var currency = currency;
        var amount = amount; 
        // TODO: Get the 2 items bewlow from the database, use the fromPhone above to find them
        var fromAddress = fromAddress;
        var privateKey =  privateKey;
        // Transfer to our hot wallet
        var toAddress =  process.env.BITCOIN_ADDRESS;

            colu.transferFunds(fromAddress, amount, toAddress, privateKey, currency, fromPhone, toPhone)
            .then(function(data) {   
            // TODO: Save the transaction ID to a new table in mongo        
            })
            .catch(function(err) {
            console.log(err);
            })

    }); //-- END PROMISE
};// END FUNCTION


//------------------------- TRANSFER FROM WALLET-------------------------
exports.fromWallet = function (fromPhone, toPhone, currency, amount) {
    return new Promise(function(resolve, reject) {   

        // Transfer from our hot wallet
        var fromAddress = process.env.BITCOIN_ADDRESS;
        var privateKey =  process.env.BITCOIN_ADDRESS_KEY;
        var encPhoneNumber = crypto.encrypt(toPhone);
            mongo.getOneUser(encPhoneNumber)
            .then(function(data) {
            var toAddress = data.bitcoin_address;
            })

            colu.transferFunds(fromAddress, amount, toAddress, privateKey, currency, fromPhone, toPhone)
            .then(function(data) {   
            // TODO: Save the transaction ID to the mongo        
            })
            .catch(function(err) {
            console.log(err);
            })

    }); //-- END PROMISE
};// END FUNCTION


