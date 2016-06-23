'use strict';

require('dotenv').config();
var fx = require('../helpers/fx.js');

//---------------- CHAI SETUP --------------------
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();
chai.config.includeStack = true; 
chai.config.showDiff = true;
chai.config.truncateThreshold = 0;

//----------------------------------- TEST FX--------------------------------//
describe("Exchange 100 USD to INR", function() {
    
    var fromCurrency = "USD"
    var toCurrency = "INR"
    var amount = 100

    it("should return a promise", function(done) {
        var test = fx.exchange(fromCurrency, toCurrency, amount);
        return test.should.be.fulfilled
        .notify(done);    
    });
    it("should return a number", function(done) {
        var test = fx.exchange(fromCurrency, toCurrency, amount);
        return test.should.eventually
        .be.an('number')
        .notify(done);    
    });    
}); 


