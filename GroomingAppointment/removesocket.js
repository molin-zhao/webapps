module.exports = function(socketArr, socketId){
  for(var i=0; i<socketArr.length; i++){
    if(socketId == socketArr[i].socketId){
      socketArr.splice(i);
      return;
    }
  }
}
