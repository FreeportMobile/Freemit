'use strict';

require('dotenv').config();
var blockexplorer = require('../helpers/blockexplorer.js');

//---------------- CHAI SETUP --------------------
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();
chai.config.includeStack = true; 
chai.config.showDiff = true;
chai.config.truncateThreshold = 0;

//------------------------ TEST BLOCK EXPLORER-----------------------//
describe("Get BTC Address Details", function() {
    var address = "16WBguy6KVyTGnF4KX7Vmdx8ztj4wENh4W"
    it("should return a promise", function(done) {
        this.timeout(3000);
        var test = blockexplorer.getAddress(address);
        return test.should.be.fulfilled
        .notify(done);    

    });
}); 

describe("Get Unspent Outputs", function() {
    var address = "16WBguy6KVyTGnF4KX7Vmdx8ztj4wENh4W"
    it("should return a promise", function(done) {
        this.timeout(3000);
        var test = blockexplorer.getUnspentOutputs(address);
        return test.should.be.fulfilled
        .notify(done);    

    });
}); 
