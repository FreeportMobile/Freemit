'use strict';

require('dotenv').config();
var crypto = require('../helpers/crypto.js');

//---------------- CHAI SETUP --------------------
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();
chai.config.includeStack = true; 
chai.config.showDiff = true;
chai.config.truncateThreshold = 0;


//----------------------------------- TEST CRYPTO--------------------------------//
describe("Make SHA256 x2", function() {
    
    it("should be a string", function(done) {
        var text = "hello";
        var test = crypto.sha256x2(text);
        test.should.be.a('string');
        done();   
    });
    

}); // END UNIT TEST


//----------------------------------- TEST CRYPTO--------------------------------//
describe("Make SHA256", function() {
    
    it("should be a string", function(done) {
        var text = "hello";
        var test = crypto.sha256(text);
        test.should.be.a('string');
        done();   
    });
    
}); // END UNIT TEST

//----------------------------------- TEST CRYPTO--------------------------------//
describe("Make UUID", function() {
    
    it("should be 36 charactors", function(done) {
        var test = crypto.makeID();
        test.should.have.length(36);
        done();   
    });
    it("should be a string", function(done) {
        var test = crypto.makeID();
        test.should.be.a('string');
        done();   
    });
    
}); // END UNIT TEST

//----------------------------------- TEST ENCRYPT--------------------------------//
describe("Encrypt a string", function() {

    var message = "TestEncrypt";
    
    it("should return an encrypted string", function(done) {
        var test = crypto.encrypt(message);
        test.should.be.a('string');
        done();   
    });
    it("should be 24 charactors", function(done) {
        var test = crypto.encrypt(message);
        test.should.have.length(24);
        done();   
    });
    
}); // END UNIT TEST

//----------------------------------- TEST DECRYPT--------------------------------//
describe("Decrypt a string", function() {

    var message = "Lz0P12rxb5XmKMcgvFCHEw==";
    
    it("should return a decrypted string", function(done) {
        var test = crypto.decrypt(message);
        test.should.equal('TestEncrypt');
        done();   
    });
    it("should be 11 charactors", function(done) {
        var test = crypto.decrypt(message);
        test.should.have.length(11);
        done();   
    });
    
}); // END UNIT TEST


//----------------------------------- MAKE JWT--------------------------------//
describe("Make JWT", function() {

    var phoneNumber = "+8618606863388";
    var un = "USA";
    
    it("should return a encrypted jwt", function(done) {
        var test = crypto.makeJWT(phoneNumber, un);
        test.should.have.length(163);
        done();   
    });
    it("should be a string", function(done) {
        var test = crypto.makeJWT(phoneNumber, un);
        test.should.be.a('string');
        done();   
    });
    
}); // END UNIT TEST

//----------------------------------- READ JWT--------------------------------//
describe("Read JWT", function() {

    var jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZV9udW1iZXIiOiIrODYxODYwNjg2MzM4OCIsInVuIjoiVVNBIiwiaWF0IjoxNDY1Mjg2NTgyfQ.Gm1LNl_RCuOiGrItWlVkPdOYpVoM5qbFBtB7WaUSXfE";
    
    it("should return a decrypted jwt", function(done) {
        var test = crypto.readJWT(jwt);
        test.phone_number.should.equal('+8618606863388');
        done();   
    });
    it("should be an object", function(done) {
        var test = crypto.readJWT(jwt);
        test.should.be.an('object');
        done();   
    });
    
}); // END UNIT TEST

