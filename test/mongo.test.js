'use strict';

require('dotenv').config();
var mongo = require('../helpers/mongo.js');

//---------------- CHAI SETUP --------------------
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();
chai.config.includeStack = true; 
chai.config.showDiff = true;
chai.config.truncateThreshold = 0;

//----------------------------------- TEST MONGO--------------------------------//
describe("Save a contact to mongo", function() {
    
    var name = "Test  User"
    var phoneNumber = "rWhfx8do6173WH9ccGDD+g==" 
    var countryCode = "+1"
    var bitcoinAddress = "144YSmxs4vH39TZauzpV48nHajUwNhGPcm"
    var encPrivateKey = "6F/tEt9gb7bORZxV3q13WxaWxA4qdiK6+ZSXUjAV1vwC5sy0vfq2NOsIbHvKGdWLOfFQIlh15qAVTrupK8RyvQ=="
    
    it("should return a promise", function(done) {
        var test = mongo.setContacts(name, phoneNumber, countryCode, bitcoinAddress, encPrivateKey);
        return test.should.be.fulfilled
        .notify(done);    
    });
    it("should return an object", function(done) {
        var test = mongo.setContacts(name, phoneNumber, countryCode, bitcoinAddress, encPrivateKey);
        return test.should.eventually
        .be.an('object')
        .notify(done);    
    });
    
}); 

