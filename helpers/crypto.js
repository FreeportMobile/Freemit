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
exports.makeJWT = function (phoneNumber) {
        return jwt.sign({ phone_number: phoneNumber }, process.env.AUTH_SECRET);
    };

//----------------------------- READ TOKEN
exports.readJWT = function (authToken) {
        try {
            var token = jwt.verify(authToken, process.env.AUTH_SECRET);
            return { phone_number: token.phone_number};
        } catch (error) {
            // TODO: Deactivate account and flag for investigation
            return { type: 'INVALID'};
        }
    };


