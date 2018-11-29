// incorporamos las dependencias
var express = require('express');
var router = express.Router();

// eportamos directamente un función para poder
// inyectar la base de datos

module.exports = function (db) {
  // incorporamos las rutas definidas de una colección
  var productosApi = require('./apisrc/productos')(db);
  var securityApi = require('./apisrc/security')(db);
  // declaramos la ruta de las entidades
  // al final en el browser o postman podremos
  // probar con https://localhost:3000/api/productos/getall

  function isAuthenticate(req, res, next){
    if(req.session.user && true){
      return next();
    }
    return res
              .status(403)
              .json({"error":"No tiene autorizacion de usar este endpoint"})
            ;
  }
  router.user('/security', securityApi);
  router.use('/productos', isAuthenticate , productosApi);

  return router;
}
