module.exports = function(redirectPage, req, res, next){
  if(req.isAuthenticated()){
    return next();
  }else{
    res.send(JSON.stringify({'status': 0, 'message': "You need to login first."}));
    res.end();
    res.redirect(redirectPage);
  }
}
