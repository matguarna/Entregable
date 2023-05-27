const { promises, appendFile, unlink, existsSync } = require("fs");
const fs = promises;

class ProductManager {
  constructor() {
    this.products = [];
    this.path = __dirname + "/productosDB.txt";
  }

  async addProduct(nuevoProducto) {
    try {
      //Valida si algun campo es undefined
      if (
        nuevoProducto.title &&
        nuevoProducto.descripcion &&
        nuevoProducto.code &&
        nuevoProducto.price &&
        nuevoProducto.stock &&
        nuevoProducto.category &&
        nuevoProducto.thumbnail != undefined
      ) {
        //Agrega status: true al nuevo producto
        nuevoProducto.status = true;

        function generarID() {
          let id = Math.random().toString(30).substring(2);
          return id;
        }

        //Verifica en el archivo si existe el code
        let productosString = await fs.readFile(this.path, "utf-8");
        let productosJSON = JSON.parse(productosString);
        this.products = productosJSON;
        let productoCode = productosJSON.find((prod) => prod.code === nuevoProducto.code);

        //Si hay un producto existente por code, le agrega stock
        if (productoCode == undefined) {
          this.products.push({ id: generarID(), ...nuevoProducto });
        } else {
          let indexStock = productosJSON.findIndex((prod) => prod.code === nuevoProducto.code);
          let nuevoStock = this.products[indexStock].stock + nuevoProducto.stock;
          this.products[indexStock].stock = nuevoStock;
          console.log(`El stock de ${nuevoProducto.title} fue actualizado`);
        }
        await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), "utf-8");
      } else {
        return console.log("Todos los campos son necesarios");
      }
    } catch (error) {
      console.log(`addProduct: ${error}`);
    }
  }

  async getProducts() {
    try {
      let productosString = await fs.readFile(this.path, "utf-8");
      let productosJSON = JSON.parse(productosString);
      return productosJSON;
    } catch (error) {
      console.log(`getProducts: ${error}`);
    }
  }

  async getProductById(id) {
    try {
      let productosString = await fs.readFile(this.path, "utf-8");
      //console.log(productosString);
      let productosJSON = JSON.parse(productosString);
      //console.log(productosJSON);
      let product = productosJSON.find((prod) => prod.id === id);
      //console.log(product);
      if (!product) return `getProductById: Not found. No existe un producto con el id: ${id}`;
      return product;
    } catch (error) {
      console.log(`getProducts: ${error}`);
    }
  }

  async updateProducts(id, propiedad, valor) {
    try {
      let productosString = await fs.readFile(this.path, "utf-8");
      let productosJSON = JSON.parse(productosString);
      this.products = productosJSON;
      //
      let indexProducto = this.products.findIndex((product) => product.id === id);
      if (indexProducto) {
        switch (propiedad) {
          case "id":
            this.products[indexProducto].id = valor;
            console.log(`Se updateó la propiedad: ${propiedad} del ${this.products[indexProducto].title} por: ${valor}`);
            break;
          case "code":
            this.products[indexProducto].nombre = valor;
            console.log(`Se updateó la propiedad: ${propiedad} del ${this.products[indexProducto].title} por: ${valor}`);
            break;
          case "title":
            this.products[indexProducto].title = valor;
            console.log(`Se updateó la propiedad: ${propiedad} del ${this.products[indexProducto].title} por: ${valor}`);
            break;
          case "descripcion":
            this.products[indexProducto].descripcion = valor;
            console.log(`Se updateó la propiedad: ${propiedad} del ${this.products[indexProducto].title} por: ${valor}`);
            break;
          case "price":
            this.products[indexProducto].price = valor;
            console.log(`Se updateó la propiedad: ${propiedad} del ${this.products[indexProducto].title} por: ${valor}`);
            break;
          case "stock":
            this.products[indexProducto].stock = valor;
            console.log(`Se updateó la propiedad: ${propiedad} del ${this.products[indexProducto].title} por: ${valor}`);
            break;
          case "thumbnail":
            this.products[indexProducto].thumbnail = valor;
            console.log(`Se updateó la propiedad: ${propiedad} del ${this.products[indexProducto].title} por: ${valor}`);
            break;
          case "category":
            this.products[indexProducto].category = valor;
            console.log(`Se updateó la propiedad: ${propiedad} del ${this.products[indexProducto].title} por: ${valor}`);
            break;
        }
      } else {
        console.log("No existe el producto con ese ID");
      }
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.log(`updateProducts: ${error}`);
    }
  }

  async deleteProduct(id) {
    try {
      let productosString = await fs.readFile(this.path, "utf-8");
      let productosJSON = JSON.parse(productosString);
      this.products = productosJSON;
      const delId = this.products.find((producto) => producto.id === id);
      console.log(`El producto ${delId.title} ha sido eliminado`);
      //Busca indice del producto y lo elimina
      const deleteIndex = this.products.findIndex((producto) => producto.id == id);
      this.products.splice(deleteIndex, 1);
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
    } catch (err) {
      console.log(`DELETE: No hay producto con ese ID. ${err}`);
    }
  }
}

// const product = new ProductManager();

//Productos
// product.addProduct({
//   title: "Remera",
//   descripcion: "Remera para hombre",
//   price: 150,
//   thumbnail: ["url", "url"],
//   code: "C1",
//   stock: 20,
//   category: "varios",
// });

// product.addProduct({
//   title: "lapiz",
//   descripcion: "lapiz de madera",
//   price: 50,
//   thumbnail: ["url", "url"],
//   code: "L5",
//   stock: 115,
//   category: "varios",
// });

// product.addProduct({
//   title: "Pantalon",
//   descripcion: "Pantalon para hombre",
//   price: 200,
//   thumbnail: ["url", "url"],
//   code: "C2",
//   stock: 10,
//   category: "varios",
// });

// product.addProduct({
//   title: "Gorra",
//   descripcion: "Gorra unisex",
//   price: 100,
//   thumbnail: ["url", "url"],
//   code: "C3",
//   stock: 15,
//   category: "varios",
// });

// product.addProduct({ title: "Gorra", descripcion: "Gorra unisex", price: 100, thumbnail: "url", code: "C3", stock: 123 }); //Mismo code con mas stock

//Muestra los productos
//console.log(`getProducts: Hay ${product.products.length} productos: `);
//console.log(product.getProducts());

//Delete
//product.deleteProduct(2);

//console.log(product.getProductById(1));

//Update
//product.updateProducts(1, "stock", 500);

module.exports = {
  ProductManager,
};
