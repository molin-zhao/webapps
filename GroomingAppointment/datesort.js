module.exports = function(date_1, date_2){
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
}
