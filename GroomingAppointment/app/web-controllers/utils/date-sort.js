module.exports = {
  greaterThan: function(date_1, date_2){
    if(date_1.year > date_2.year){
      return 1;
    }else if(date_1.year == date_2.year){
      if(date_1.month >= date_2.month){
        return 1;
      }else{
        return 0;
      }
    }else{
      return 0;
    }
  },

  dateSort: function(result){
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
}
