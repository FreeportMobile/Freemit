'use strict';

var aes = require('aes-cross');
var uuid = require('uuid-js');

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


