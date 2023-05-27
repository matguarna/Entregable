//Importamos el productModel
const { productModel } = require("../../models/product.model");

class ProductManagerMongo {
  async getProducts() {
    try {
      return await productModel.find({}).lean();
    } catch (error) {
      console.log("getProducts Mongo", error);
    }
  }
  async getProductById(pid) {
    try {
      return await productModel.findOne({ _id: pid });
    } catch (error) {
      console.log("getProductById Mongo", error);
    }
  }

  async addProduct(newProduct) {
    try {
      return await productModel.create(newProduct);
    } catch (error) {
      console.log("addProduct Mongo", error);
    }
  }

  async updateProduct() {
    try {
    } catch (error) {
      console.log("updateProduct Mongo", error);
    }
  }
  async deleteProduct() {
    try {
    } catch (error) {
      console.log("deleteProduct Mongo", error);
    }
  }

  async stagesProduct() {
    try {
      const resultProd = await productModel.aggregate([
        //stages
        //match: trae los productos que coincidan con la condicion dada
        {
          $match: { price: 500 },
        },
        {
          //agrupa los "title" iguales, y en la propiedad totalStock, suma sus "stock"
          $group: { _id: "$title", totalStock: { $sum: "$stock" } },
        },
        {
          //ordena por stock de mayor a menor
          $sort: { totalStock: -1 },
        },
        {
          //el 1 de _id significa true. Este group agrupa en un solo objeto las ordenes, en nuestro ROOT. orders es el array que estamos creando, y con push se guardan los datos en el array
          $group: { _id: 1, orders: { $push: "$$ROOT" } },
        },
        {
          //creamos el objeto de la coleccion. _id:0 sigfinica que genere un _id propio
          $project: {
            _id: 0, //si es 0 o false, crea un _id generico
            orders: "$orders", //hace referencia al valor del orders de arriba
          },
        },
        {
          //crea la coleccion "reportes" si no existe, y agrega dentro el reporte. Este stage "$merge" debe ser el ultimo stage
          $merge: {
            into: "reportes",
          },
        },
      ]);
      console.log(resultProd);
      return resultProd;
    } catch (error) {
      console.log("stagesProduct Mongo", error);
    }
  }
}

module.exports = ProductManagerMongo;
