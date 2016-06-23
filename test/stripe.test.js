'use strict';

require('dotenv').config();
var stripe = require('../helpers/stripe.js');

//---------------- CHAI SETUP --------------------
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();
chai.config.includeStack = true; 
chai.config.showDiff = true;
chai.config.truncateThreshold = 0;

//----------------------------------- TEST STRIPE--------------------------------//
describe("Make payment with Stripe", function() {
    
    var timeNow = Date.now().toString();
    var userID = "00000000001"
    var cardMonth = "12"
    var cardYear = "2018"
    var cardNumber = "4242424242424242"
    var cardCVC = "321"
    var value = "101"
    var currency = "USD"
    var source = {exp_month:cardMonth, exp_year:cardYear, number:cardNumber,object:'card',cvc:cardCVC};
    var description = "Unit Test"
    var metadata = {id:userID, time:timeNow, value:value, currency:currency};
    var idempotencyKey = Math.random();

    it("should return a promise", function(done) {
        this.timeout(3000);
        var test = stripe.createCharge(value, currency, source, description, metadata, idempotencyKey);
        return test.should.be.fulfilled
        .notify(done);    
    });
    it("should return an object", function(done) {
        this.timeout(3000);
        var test = stripe.createCharge(value, currency, source, description, metadata, idempotencyKey);
        return test.should.eventually
        .be.an('object')
        .notify(done);    
    });
    it("should return sucessfull payment", function(done) {
        this.timeout(3000);
        var test = stripe.createCharge(value, currency, source, description, metadata, idempotencyKey);
        return test.should.eventually
        .have.property('status','succeeded')
        .notify(done);    
    });

    it("should reject a bad number", function(done) {
        this.timeout(3000);
        var test = stripe.createCharge(0, currency, source, description, metadata, idempotencyKey);
        return test.should.be.rejected
        .notify(done);    
    });
    
}); // END UNIT TEST


