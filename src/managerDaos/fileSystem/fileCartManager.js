const { promises, appendFile, unlink, existsSync } = require("fs");
const fs = promises;

class CartManager {
  constructor() {
    this.path = __dirname + "/cartsDB.txt";
    this.cartList = [];
    this.pathProduct = __dirname + "/productosDB.txt";
  }

  async addCart() {
    try {
      let cartsString = await fs.readFile(this.path, "utf-8");
      let cartsJSON = JSON.parse(cartsString);
      this.cartList = cartsJSON;

      //Funcion para generar ID
      const generarID = () => {
        let id = Math.random().toString(30).substring(2);
        return id;
      };
      let idGenerado = generarID();

      this.cartList.push({ id: idGenerado, products: [] });
      console.log(`Se creó el carrito con ID: ${idGenerado}`);
      await fs.writeFile(this.path, JSON.stringify(this.cartList, null, 2), "utf-8");
      return idGenerado;
    } catch (error) {
      console.log(`addCart: ${error}`);
    }
  }

  async getCart(id) {
    try {
      let cartsString = await fs.readFile(this.path, "utf-8");
      let cartsJSON = JSON.parse(cartsString);
      let productsCart = cartsJSON.find((cart) => cart.id === id);

      if (!productsCart) return `getCart: Not found. No existe un carrito con el id: ${id}`;
      return productsCart.products;
    } catch (error) {
      console.log(`getCart: ${error}`);
    }
  }

  async addProductCart(cid, pid) {
    try {
      let cartsString = await fs.readFile(this.path, "utf-8");
      let cartsJSON = JSON.parse(cartsString);
      this.cartList = cartsJSON;
      let indexCart = cartsJSON.findIndex((cart) => cart.id === cid);
      //Si el carrito existe, busca el producto
      if (indexCart > -1) {
        let productosString = await fs.readFile(this.pathProduct, "utf-8");
        let productosJSON = JSON.parse(productosString);
        let productID = productosJSON.find((prod) => prod.id === pid);
        //Si el producto existe, lo agrega al carrito
        if (!productID) {
          return console.log(`Producto addProductCart: Not found. No existe un producto con el id: ${pid}`);
        } else {
          //Si el producto ya existe en el carrito, le agrega 1 a la cantidad
          //Indice del producto del carrito encontrado
          let indexProduct = this.cartList[indexCart].products.findIndex((product) => product.idProducto === pid);
          //Si no lo encuentra es = -1
          if (indexProduct > -1) {
            this.cartList[indexCart].products[indexProduct].quantity += 1;
            await fs.writeFile(this.path, JSON.stringify(this.cartList, null, 2), "utf-8");
          } else {
            this.cartList[indexCart].products.push({ idProducto: pid, quantity: 1 });
            await fs.writeFile(this.path, JSON.stringify(this.cartList, null, 2), "utf-8");
          }
          console.log(this.cartList);
          return console.log(`Producto agregado al carrito ID: ${cid}`);
        }
      } else {
        return console.log(`addProductCart: Not found. No existe un carrito con el id: ${cid}`);
      }
    } catch (error) {
      console.log(`addProductCart: ${error}`);
    }
  }
}

module.exports = {
  CartManager,
};

// const cartManager = new CartManager();
// // cartManager.addCart();
// cartManager.addProductCart("c0mql03af79", "24eka1qtfdcn");
