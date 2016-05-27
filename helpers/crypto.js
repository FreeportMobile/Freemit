'use strict';

var aes = require('aes-cross');
var uuid = require('uuid-js');
var jwt = require('jsonwebtoken');

//----------------------------- MAKE UUID
exports.makeID = function () {
    return uuid.create().toString();
};

//----------------------------- ENCRYPT
exports.encrypt = function (text) {
    var key = process.env.AUTH_SECRET;
    var enc = aes.encText(text,key);
    return enc
};

//----------------------------- DECRYPT
exports.decrypt = function (text) {
    var key = process.env.AUTH_SECRET;
    var dec = aes.decText(text,key);
    return dec
};

//----------------------------- MAKE TOKEN
exports.makeJWT = function (phoneNumber, un) {
        // UN IS A 3 LETTER COUNTRY ABREVATION 
        return jwt.sign({ phone_number: phoneNumber, un:un }, process.env.AUTH_SECRET);
    };

//----------------------------- READ TOKEN
exports.readJWT = function (token) {
        try {
            var token = jwt.verify(token, process.env.AUTH_SECRET);
            return { phone_number: token.phone_number};
        } catch (error) {
            // TODO: Deactivate account and flag for investigation
            return { type: 'INVALID'};
        }
    };


