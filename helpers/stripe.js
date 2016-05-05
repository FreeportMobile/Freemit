'use strict';

var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


//----------------------------- CREATE CHARGE
exports.createCharge = function (value, currency, source, description, metadata, idempotencyKey) {
    return new Promise(function(resolve, reject) { 
        stripe.charges.create({
            amount: value * 100, // STRIPE WANTS THE AMOUNT IN CENTS 
            currency: currency, 
            source: source, 
            description: description, 
            metadata: metadata,
        }, {
            idempotency_key: idempotencyKey // unique key for each charge gnerate on client
            }, function(err, charge) {
                if (err){
                    reject(err);
                } else {
                    resolve(charge);
                }

        }); //-- END CREATE CHARGE
    }); //-- END PROMISE
}; //-- END FUNCTION


//----------------------------- TRANSFER
exports.transfer = function (phoneNumber, verificationCode) {
    return new Promise(function(resolve, reject) {
 
         
    }); //-- END PROMISE
}; //-- END FUNCTION