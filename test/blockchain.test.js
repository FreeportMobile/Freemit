'use strict';

require('dotenv').config();
var blockchain = require('../helpers/blockchain.js');

//---------------- CHAI SETUP --------------------
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();
chai.config.includeStack = true; 
chai.config.showDiff = true;
chai.config.truncateThreshold = 0;

//------------------------- BLOCKCHAIN--------------------------------//
describe("Make a new bitcoin address", function() {
    it("should return a promise", function(done) {
        this.timeout(3000);
        var test = blockchain.makeAddress();
        return test.should.be.fulfilled
        .notify(done);    
    });
}); 


describe("Make a new bitcoin transaction", function() {
    it("should return a promise", function(done) {
        this.timeout(3000);
        var test = blockchain.makeTransaction();
        return test.should.be.fulfilled
        .notify(done);    
    });
}); 

describe("Make a new OP_RETURN transaction", function() {
    it("should return a promise", function(done) {
        this.timeout(3000);
        var message ="bkawk" 
        var fromKey = "KwFmrKDWXT6oNKQ9QosHTU3Vpp6EPT9ExVbq7n8Rq613ARsSr8vs"
        var test = blockchain.opReturn(message, fromKey);
        return test.should.be.fulfilled
        .notify(done);    
    });
}); 

