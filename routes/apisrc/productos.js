// incorporamos las dependencias
var express = require('express');
var router = express.Router();

// exportamos directamente un función para poder
// inyectar la base de datos

module.exports = function (db) {


  const productos = require('./productos.model')(db);
  // declaramos la ruta de las entidades
  // al final en el browser o postman podremos
  // probar con https://localhost:3000/api/productos/getall

  router.get('/getall', function (req, res, next) {
    // llamamos al método find de la colección sin parametros para
    // obtener todos los documentos almacenados
    // luego usamos el método getArray para convertir el cursor
    // en un arreglo que podamos utilizar.
    productos.many( {}, (err, docs) => {
      if (err) return res.status(404).json({ "error": "Error al buscar" });
      return res.status(200).json(docs);
    });
  }); // end get

  router.get('/byid/:codigo', function(req, res, next) {
    var codigo = req.params.codigo;
    //var query = {"_id": codigo};
    productos.one(codigo, (err, producto)=>{
      if(err) return res.status(500).json({"error":"error al extraer documento solicitado."});
      return res.status(200).json(producto);
    }); // end productoOne
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
      productos.many(query, (err, productos) => {
        if(err) return res.status(500).json({"error":"Error al extraer los datos solicitados"});
        return res.status(200).json(productos);
      }); // end find toArray
    }
    );// get price range

    // ruta devuela los producto con precio menor o igual a un parametro
    router.get('/bytag/:tag', function(req, res, next){
      var tag = req.params.tag;
      var _query = {"tag": tag};
      productos.many(_query, (err, productos) => {
        if(err) return res.status(500).json({"error":"Errora al extraer por tag"});
        return res.status(200).json(productos);
      });
    }); //by tag

    router.put('/byid/:codigo/tag/:tag', function(req, res, next){
      var query = {"codigo": req.params.codigo};
      var upd = {"$push":{"tag": req.params.tag}};
      productos.upd(query, upd, (err, result) => {
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
      productos.new(_nuevoProducto, (err, rslt) => {
        if(err) return res.status(500).json({"error":"Error al guardar productos"});
        return  res.status(203).json({"message":"Producto Guardado Exitosamente"});
      });//end insert
    }
    );// end new

    router.delete('/byid/:id', (req, res, next)=>{
        productos.del(req.params.id, (err, rslt)=>{
          if (err) return res.status(500).json({"error":"No se pudo eliminar documento"});
          return res.status(200).json({"msg":"Ok"});
        });
    });// delete

    // proyeccion 
    // order 

    // select usuariocod, usurioname, usuarioest from  ususario;
    // p = {"atributo":1, "atrubuto2":1} ?codigo=adsfa&tag="valor"
 router.get('/all/:pageitems/:page', (req, res, next)=>{
  let filter = req.query;
  let pageItems = parseInt(req.params.pageitems);
  let page = parseInt(req.params.page);
  productos.getByPage(filter,pageItems, page, (err, _productos)=>{
    if(err) return res.status(500).json({"error":"Error al obtener los datos"});
    return res.status(200).json(_productos);
  } );
 });// get producto

  return router;
}
