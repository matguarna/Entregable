//Archivo donde estan las rutas del server (app.js)
const { Router } = require("express");
const userRouter = require("./users.router");
const fileProductRouter = require("./fileRoutes/fileproducts.router");
const fileCartRouter = require("./fileRoutes/filecarts.router");
const productRouterMongo = require("./products.router");
const cartRouterMongo = require("./carts.router");
const viewsRouter = require("./views.router");
const { uploader } = require("../utils/multer");
const sessionRouter = require("../routes/session.routes");
const routerApp = Router();

routerApp.use("/file/carts", fileCartRouter);
routerApp.use("/file/products", fileProductRouter);
routerApp.use("/api/usuarios", userRouter);
routerApp.use("/api/productos", productRouterMongo);
routerApp.use("/api/carts", cartRouterMongo);
routerApp.use("/views", viewsRouter);
routerApp.use("/api/session", sessionRouter);

routerApp.use((req, res, next) => {
  console.log("Middleware app - time: ", Date.now());
  next();
});

routerApp.post("/upload", uploader.single("myFile"), (req, res) => {
  res.send({
    status: "success",
    mensaje: "Archivo subido OK",
  });
});

//Middleware por si se rompe algo
routerApp.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Todo roto");
});

module.exports = routerApp;
