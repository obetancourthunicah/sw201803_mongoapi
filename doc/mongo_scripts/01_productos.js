use sw201803;
var productos = [];
for(var i = 0; i<100; i++){
  var doc = {
    "codigo":"prd" + (i+1),
    "descripcion" : "Producto X de Demo",
    "precio" : Math.round(Math.random() * 150,2),
    "iva" : 0.15,
    "fecha" : new Date().getTime()
  }
  productos.push(doc);
}
db.productos.insert(productos);
