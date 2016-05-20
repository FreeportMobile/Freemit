'use strict';

//--- ADD EXCHANGE
exports.add = function (socket, io, msg) {
    io.to(socket.id).emit('addexchange', {msg: 200});
};