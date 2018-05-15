const greaterThan = require('./datesort.js');
module.exports = function(result){
  for(var i = 0; i < result.length - 1; i++){
    var min = i;
    for(var j = i + 1; j < result.length; j++){
      if(greaterThan(result[min], result[j])){
        min = j;
      }
    }
    if(min != i){
      var temp = result[j];
      result[j] = result[i];
      result[i] = temp;
    }
  }

  return result;
}
