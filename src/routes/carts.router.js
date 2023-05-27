const { Router } = require("express");
const CartManagerMongo = require("../managerDaos/mongo/cart.mongo");
const cartManagerMongo = new CartManagerMongo();
const cartRouterMongo = Router();

cartRouterMongo.get("/", async (req, res) => {
  try {
    //const newProduct = req.body;
    let result = await cartManagerMongo.addCart();
    res.status(200).send({ status: "success", payload: result });
  } catch (error) {
    console.log("cartRouterMongo get: Error", error);
  }
});

//Mostrar productos
cartRouterMongo.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManagerMongo.getCartById(cid);
    let { products } = cart;
    res.render("cart.handlebars", {
      status: "success",
      payload: products,
    });
  } catch (error) {
    console.log(error);
  }
});


//Agrega producto al carrito
cartRouterMongo.get("/:cid/:pid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { pid } = req.params;
    const cart = await cartManagerMongo.addProductToCart(cid, pid);
    res.status(200).send({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
  }
});

//Agrega un producto o actualiza cantidad
cartRouterMongo.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    await cartManagerMongo.updateProduct(cid, pid, quantity);

    res.status(200).send({ status: "success", payload: `Cart ${cid} actualizado` });
  } catch (error) {
    console.log("updateCart error", error);
  }
});

//Elimina un producto
cartRouterMongo.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    let realizado = await cartManagerMongo.deleteProduct(cid, pid);
    if (realizado) {
      res.status(200).send({ status: "success", payload: `Producto ${pid} eliminado del Cart ${cid}` });
    }
  } catch (error) {
    console.log("updateCart error", error);
  }
});

//Vacia cart completo
cartRouterMongo.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    let realizado = await cartManagerMongo.deleteAllProducts(cid);
    if (realizado) {
      res.status(200).send({ status: "success", payload: `Cart ${cid} vaciado` });
    }
  } catch (error) {
    console.log("updateCart error", error);
  }
});

module.exports = cartRouterMongo;
