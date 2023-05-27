const { Router } = require("express");
//Importa ProductManagerMongo
const ProductManagerMongo = require("../managerDaos/mongo/product.mongo");
const productManagerMongo = new ProductManagerMongo();
const productRouterMongo = Router();
const { productModel } = require("../models/product.model");

//getProducts
productRouterMongo.get("/", async (req, res) => {
  try {
    const products = await productManagerMongo.getProducts();
    res.status(200).send({ status: "success", payload: products });
  } catch (error) {
    console.log(error);
  }
});

//stages
productRouterMongo.get("/stages", async (req, res) => {
  try {
    const products = await productManagerMongo.stagesProduct();
    res.status(200).send({ status: "success", payload: products });
  } catch (error) {
    console.log(error);
  }
});

//mongoosePaginate
productRouterMongo.get("/paginate", async (req, res) => {
  try {
    //Limit
    let { limit } = req.query;
    let limite;
    if (!limit) {
      limite = 10;
    } else {
      limite = limit;
    }

    //Page
    let { pagina } = req.query;
    let pag;
    if (!pagina) {
      pag = 1;
    } else {
      pag = pagina;
    }

    //Query
    let { query } = req.query;
    let filtro;
    if (!query) {
      filtro = {};
    } else {
      if (query) {
        filtro = { category: query };
      }
    }

    console.log("LOGS PAGINATE");
    const userLogueado = req.session.user;
    console.log(userLogueado);

    //Varible con los productos
    let productosPaginate = await productModel.paginate(filtro, { limit: limite, page: pag, lean: true });

    let { docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages, page } = productosPaginate;

    //Sort
    let { sort } = req.query;
    //PROBLEMA: primero limita los prod de la db y luego hace el sort
    if (sort) {
      //deberia: traer todo sin limite, ordenarlos, limitarlos, mostrarlos
      //let todosProd = await productManagerMongo.getProducts();
      // console.log(todosProd);
      if (sort == "asc") {
        docs = docs.sort((a, b) => {
          if (a.price > b.price) {
            return 1;
          }
          if (a.price < b.price) {
            return -1;
          }
          return 0;
        });
      } else if (sort == "desc") {
        docs = docs.sort((a, b) => {
          if (a.price < b.price) {
            return 1;
          }
          if (a.price > b.price) {
            return -1;
          }
          return 0;
        });
      }
    }

    //PROBLEMA CON LA URL: Cada peticion hace una nueva lista desordenada, las querys no se aplican al cambiar de pagina
    //url

    console.log(req.url);

    //let url;

    // if (req.url == "/paginate") {
    //   prevPage = false;
    //   nextPage = page + 1;
    //   url = req.url + "?pagina=" + nextPage;
    // } else if (req.url != "/paginate") {
    //   prevPage = false;
    //   nextPage = page + 1;
    //   url = req.url + "&pagina=" + nextPage;
    // }

    //console.log(productosPaginate);

    res.render("products.handlebars", {
      status: "success",
      payload: docs,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      page,
      totalPages,
      userLogueado,
    });
  } catch (error) {
    console.log("get Paginate ERROR", error);
  }
});

//getProductById
productRouterMongo.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManagerMongo.getProductById(pid);
    res.status(200).send({ status: "success", payload: product });
  } catch (error) {
    console.log(error);
  }
});

//addProduct
productRouterMongo.post("/", async (req, res) => {
  try {
    const newProduct = req.body;

    let result = await productManagerMongo.addProduct(newProduct);

    res.status(200).send({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
  }
});

//updateProduct
productRouterMongo.put("/:pid", async (req, res) => {
  const products = await productManagerMongo.updateProduct();
  res.status(200).send({ status: "success", payload: products });
});

//deleteProduct
productRouterMongo.delete("/:pid", async (req, res) => {
  const products = await productManagerMongo.deleteProduct();
  res.status(200).send({ status: "success", payload: products });
});

module.exports = productRouterMongo;
