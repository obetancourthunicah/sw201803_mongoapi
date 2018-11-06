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
    
    router.get('/bytag/:tag', function(req, res, next){
      var tag = req.params.tag;
      var _query = {"tag": tag};
      productosColl.find(_query).toArray(function(err, productos){
        if(err) return res.status(500).json({"error":"Errora al extraer por tag"});
        return res.status(200).json(productos);
      });
    }); //by tag

    router.put('/byid/:codigo/tag/:tag', function(req, res, next){
      var query = {"codigo": req.params.codigo};
      var upd = {"$push":{"tag": req.params.tag}};
      productosColl.updateOne(query, upd, function(err, result){
        if(err) return res.status(500).json({"error":"Error al agregar etiqueta"});
        return res.status(200).json({"status":"ok"});
      });
    });
    /*
    "_id" : ObjectId("5bcfbd21ba7ca8ff141c2f15"),
	"codigo" : "prd001",
	"descripcion" : "Producto X de Demo",
	"precio" : 123.23,
	"iva" : 0.16,
	"fecha" : 1540340909734,
	"tag" : [
		"retail",
		"high"
	],
	"stock" : 5
    */
    /// Crear un nuevo producto
    router.post('/new',  (req, res, next) => {
      // var _nuevoProducto = Object.assign({},req.body);
      // unmutabilidad de objetos
      let _nuevoProducto = { ...req.body };
      _nuevoProducto.iva = parseFloat(_nuevoProducto.iva);
      _nuevoProducto.stock = parseInt(_nuevoProducto.stock);
      _nuevoProducto.fecha = new Date().getTime();
      _nuevoProducto.precio = parseFloat(_nuevoProducto.precio);
      productosColl.insert(_nuevoProducto, (err, rslt) => {
        if(err) return res.status(500).json({"error":"Error al guardar productos"});
        return  res.status(203).json({"message":"Producto Guardado Exitosamente"});
      });//end insert
    }
    );// end new
  return router;
}
