module.exports = {
  removeSocket: function(socketArr, socketId){
    for(var i=0; i<socketArr.length; i++){
      if(socketId == socketArr[i].socketId){
        socketArr.splice(i);
        return;
      }
    }
  },
  socketMessage: function(io, socketArr, message, data){
    for(var i=0; i<socketArr.length; i++){
      io.sockets.to(socketArr[i].socketId).emit(message, data);
    }
  }
}
