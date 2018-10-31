// incorporamos las dependencias
var express = require('express');
var router = express.Router();

// exportamos directamente un función para poder
// inyectar la base de datos

module.exports = function (db) {

  //Definimos la colección que vamos a utilizar para obtener la data
  var productosColl = db.collection('productos');

  // declaramos la ruta de las entidades
  // al final en el browser o postman podremos
  // probar con https://localhost:3000/api/productos/getall

  router.get('/getall', function (req, res, next) {

    // llamamos al método find de la colección sin parametros para
    // obtener todos los documentos almacenados
    // luego usamos el método getArray para convertir el cursor
    // en un arreglo que podamos utilizar.

    productosColl.find().toArray(function (err, docs) {
      // si hay un error devolvemos al cliente un error con mensaje
      if (err) {
        return res.status(404).json({ "error": "Error al buscar" });
      }

      // Si no hay error le devolvemos las coleccion de documentos en
      // la colección.
      return res.status(200).json(docs);
    });
  }); // end get

  router.get('/byid/:codigo', function(req, res, next) {
    var codigo = req.params.codigo;
    var query = {"codigo": codigo};
    productosColl.findOne(query, function(err, producto){
      if(err) return res.status(500).json({"error":"error al extraer documento solicitado."});
      return res.status(200).json(producto);
    }); // end findone
  } ); // end get by id

  router.get('/price/range/:from/:to/:includeEndPoints',
    function(req, res, next) {
      var _from = parseInt(req.params.from);
      var _to = parseInt(req.params.to);
      var _includeEndPoints = parseInt(req.params.includeEndPoints) && true;

      var query = {
        "precio": { "$gt": _from , "$lt": _to }
      }
      if(_includeEndPoints){
        query = {
          "precio": { "$gte": _from , "$lte": _to }
        }
      }
      productosColl.find(query).toArray(function(err, productos){
        if(err) return res.status(500).json({"error":"Error al extraer los datos solicitados"});
        return res.status(200).json(productos);
      }); // end find toArray
    }
    );// get price range

    // ruta devuela los producto con precio menor o igual a un parametro
    


  return router;
}
