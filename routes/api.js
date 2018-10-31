// incorporamos las dependencias
var express = require('express');
var router = express.Router();

// eportamos directamente un función para poder
// inyectar la base de datos

module.exports = function (db) {
  // incorporamos las rutas definidas de una colección
  var productosApi = require('./apisrc/productos')(db);

  // declaramos la ruta de las entidades
  // al final en el browser o postman podremos
  // probar con https://localhost:3000/api/productos/getall

  router.use('/productos', productosApi);

  return router;
}
