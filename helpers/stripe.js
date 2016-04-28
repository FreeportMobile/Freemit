'use strict';

var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//----------------------------- CTREATE CUSTOMER
exports.createCustomer = function(stripeToken, description, metaData){
    return new Promise(function(resolve, reject) {
    
        stripe.customers.create({
            description: description,
            metadata: metaData,
            source: stripeToken // obtained with Stripe.js from the front end.
        }, function(err, customer) {
               if (err){
                    console.log(err)
                    reject(err);
                } else {
                    console.log(customer)
                    resolve(customer);
                }
        });
        
    }); //-- END PROMISE
}; //-- END FUNCTION



//----------------------------- CREATE CHARGE
exports.createCharge = function (amount, currency, source, description, metadata, idempotency_key) {
    return new Promise(function(resolve, reject) {
      
        stripe.charges.create({
            amount: amount, // value or amount 400 = 400 CHECK decimal position!
            currency: currency, // usd, gbp
            source: source, // obtained with Stripe.js ?????
            description: description, // string 
            metadata: metadata // JSON FORMATED
        }, {
            idempotency_key: idempotency_key // unique key for each charge gnerate on client
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