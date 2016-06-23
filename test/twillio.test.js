'use strict';

require('dotenv').config();
var twillio = require('../helpers/twillio.js');

//---------------- CHAI SETUP --------------------
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();
chai.config.includeStack = true; 
chai.config.showDiff = true;
chai.config.truncateThreshold = 0;

//----------------------------------- TEST TWILLIO --------------------------------//
describe("Send SMS via Twillio", function() {

    it("should return a promise", function(done) {
        var test = twillio.sendSMS('+14083297423','Test SMS Success');
        return test.should.be.fulfilled
        .notify(done);
        
    });
    it("should return an object", function(done) {
        var test = twillio.sendSMS('+14083297423','Test SMS Success');
        return test.should.eventually
        .be.an('object')
        .notify(done);

    });
    it("should return our account id", function(done) {
        var test = twillio.sendSMS('+14083297423','Test SMS Success');
        return test.should.eventually
        .have.property('account_sid','ACb454ed77934149690b5b3570fff81b1a')
        .notify(done);

    });
    it("should return our account id of 34 characters", function(done) {
        var test = twillio.sendSMS('+14083297423','Test SMS Success');
        return test.should.eventually
        .have.property('account_sid','ACb454ed77934149690b5b3570fff81b1a').with.length(34)
        .notify(done);

    });
    it("should reject a bad number", function(done) {
        var test = twillio.sendSMS('1','Test SMS Reject');
        return test.should.be.rejected
        .notify(done);

    });
    
}); // END UNIT TEST



