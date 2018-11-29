var express = require('express');
var router =  expres.Router();
function routerInit(db){
  router.post('/login', function(req, res, next){
    if( req.body.user === "admin" && req.body.pswd == "notallowed"){
      req.session.user = "admin";
      return res.status(200).json({"status":"logged"});
    }else{
      return res.status(404).json({ "status": "NotAllowed" });
    }
  });
  router.get('/logout', function( req, res, next){
    delete req.session.user;
    res.status(200).json({"status":"loggedout"});
  } );

  return router;
}


module.exports = routerInit;
