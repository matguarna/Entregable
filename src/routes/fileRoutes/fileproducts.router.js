const { Router } = require("express");
const { ProductManager } = require("../../managerDaos/fileSystem/fileProductManager");

const fileProductRouter = Router();
const fileProductManager = new ProductManager();

//GET. Trae los productos del archivo
fileProductRouter.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    let productos = await fileProductManager.getProducts();
    if (!limit) {
      return res.send({ status: "success", payload: productos });
    } else {
      //http:localhost:8080/products?limit=2
      return res.send({ status: "success", payload: productos.slice(0, limit) });
    }
  } catch (error) {
    res.send(error);
  }
});

//GET. Trae producto por ID
fileProductRouter.get("/:pid", async (req, res) => {
  try {
    let { pid } = req.params; //Trae el "pid" como string
    //pid = Math.floor(pid); //Convierte el string a numero
    let producto = await fileProductManager.getProductById(pid);
    res.send({ producto });
  } catch (error) {
    res.send(error);
  }
});

//POST . agrega un nuevo producto
fileProductRouter.post("/", async (req, res) => {
  try {
    const productBody = req.body;
    await fileProductManager.addProduct(productBody);
    res.status(200).send(`Producto "${productBody.title}" agregado`);
  } catch (error) {
    res.send(`Product POST: ${error}`);
  }
});

//PUT. Actualiza un campo de un producto
fileProductRouter.put("/:pid", async (req, res) => {
  try {
    let { pid } = req.params;
    let productBody = req.body;
    //Funcion para traer el campo a actualizar
    function traerPropiedad() {
      for (propiedad in productBody) {
        let productBodyProp = propiedad;
        return productBodyProp;
      }
    }
    //Valor de la propiedad
    let valorPropiedad = Object.values(productBody)[0];

    await fileProductManager.updateProducts(pid, traerPropiedad(), valorPropiedad);

    res.send(`Producto actualizado`);
  } catch (error) {
    res.send(`Product PUT: ${error}`);
  }
});

//DELETE. Elimina producto por ID
fileProductRouter.delete("/:pid", async (req, res) => {
  try {
    let { pid } = req.params;
    await fileProductManager.deleteProduct(pid);
    res.send("Producto eliminado");
  } catch (error) {
    res.send(error);
  }
});

module.exports = fileProductRouter;
