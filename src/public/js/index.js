console.log("Este es el index.js");
// const CartManagerMongo = require("../../managerDaos/mongo/cart.mongo");
import CartManagerMongo from "../../managerDaos/mongo/cart.mongo";
const cmm = new CartManagerMongo();

const agregarAlCart = async () => {
  try {
    console.log("asdddd");
    let inputId = document.getElementById("inputId");
    let cid = inputId.value;
    let botonAgregar = document.getElementById("botonAgregar");
    let pid = botonAgregar.value;
    let quantity = 1;

    console.log(pid);
    console.log(cid);

    cmm.updateProduct(cid, pid, quantity);
    console.log("Producto agregado al carrito");
  } catch (error) {
    console.log("agregarAlCart ERROR", error);
  }
};
