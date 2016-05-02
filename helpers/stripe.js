'use strict';

var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


//----------------------------- CREATE CHARGE
exports.createCharge = function (value, currency, source, description, metadata, idempotencyKey) {
    return new Promise(function(resolve, reject) {
      
        stripe.charges.create({
            amount: value, // value or amount 400 = 400 CHECK decimal position!
            currency: currency, // usd, gbp
            source: source, // obtained with Stripe.js ?????
            description: description, // string 
            metadata: metadata // JSON FORMATED
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


//----------------------------- CREATE CHARGE
exports.paymentOut = function (phoneNumber, verificationCode) {
    return new Promise(function(resolve, reject) {
 
         
    }); //-- END PROMISE
}; //-- END FUNCTION