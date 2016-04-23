'use strict';

//--- ADD USER
exports.add = function (socket, io, msg) {
    console.log('Add User');
    io.to(socket.id).emit('adduser', {msg: 200});
};