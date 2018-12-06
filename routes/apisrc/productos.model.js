const ObjectID = require("mongodb").ObjectID;

module.exports = ( db ) => {
  var productosColl = db.collection('productos');
  return {
    "many": (query, callback ) => {
      productosColl.find(query).toArray( (err, docs) => {
        // si hay un error devolvemos al cliente un error con mensaje
        if (err) return callback(err, null);
        return callback(null, docs);
      });
    },
    "one": (query, callback) => {
      productosColl.findOne({"_id": new ObjectID(query)}, (err, producto) => {
        if (err) return callback(err, null);
        return callback(null, producto);
      });
    },
    "upd" : (query, upd, callback) => {
      productosColl.updateOne(query, upd, (err, result) => {
        if (err) return callback(err, null);
        return callback(null, result);
      });
    },
    "dlt": (id, callback) => {
      let query = {"_id": ObjectID(id)};
      productosColl.remove(query, upd, (err, result) => {
        if (err) return callback(err, null);
        return callback(null, result);
      });
    },
    "new": (producto, callback) => {
      productosColl.insert(producto, (err, rslt) => {
        if (err) return callback(err, null);
        return callback(null, rslt);
      });
    },
    "getByPage": (filter, pageLimit, pageNumber, callback) => {
      productosColl.find(filter, 
        {
          "projection": {"codigo":1, "descripcion":1},
          "sort": [ ["codigo", -1] ],
          "skip": (pageNumber -1) * pageLimit,
          "limit": pageLimit
        }
      ).toArray((err, productos)=>{
        if(err) return callback(err, null);
        return callback(null, productos);
      })
    }
  }
}
