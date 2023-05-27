const { Router } = require("express");
const auth = require("../middlewares/autenticacion.middleware");
const { userModel } = require("../models/user.model");

const sessionRouter = Router();

//Render de login
sessionRouter.get("/", (req, res) => {
  res.render("login", {});
});

//Sessiones________ Datos del cliente que se guardan del lado del servidor
sessionRouter.get("/counter", (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.send(`Se ha visitado el sitio ${req.session.counter} veces.`);
  } else {
    req.session.counter = 1;
    res.send("Bienvenido");
  }
});

//Register
sessionRouter.post("/register", async (req, res) => {
  try {
    const { username, first_name, last_name, email, password } = req.body;
    //Validar si vienen distinto de vacio && caracteres especiales

    //Validar si existe el mail
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res.send({ status: "Error", message: "El email ya existe" });
    }
    const newUser = {
      username,
      first_name,
      last_name,
      email,
      password, //encriptar
    };
    let resultUser = await userModel.create(newUser);

    res.status(200).send({ status: "sucess", message: "Usuario creado correctamente", resultUser });
  } catch (error) {
    console.log("sessionRouter Register ERROR", error);
  }
});

//Login con session
sessionRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  //valida email y passwd
  const userDB = await userModel.findOne({ email, password }).lean();
  //funcion para validar el pass xq va a estar encriptado

  console.log(userDB);

  if (!userDB) {
    req.session.user = {
      email: email,
      password: password,
    };
    if (req.session.user.email == "adminCoder@coder.com" && req.session.user.password == "adminCod3r123") {
      req.session.user = {
        first_name: "Coder",
        last_name: "House",
        email: "adminCoder@coder.com",
        username: "CoderAdmin",
        role: "admin",
      };
      return res.redirect("http://localhost:8080/api/productos/paginate");
    }
    return res.send({ status: "error", message: "Logueo incorrecto" });
  }

  //Guarda los datos en la sesion
  req.session.user = {
    first_name: userDB.first_name,
    last_name: userDB.last_name,
    email: userDB.email,
    username: userDB.username,
    role: "usuario",
  };

  console.log(req.session.user);
  //   res.send({ status: "success", message: "Login success", session: req.session.user });
  res.redirect("http://localhost:8080/api/productos/paginate");
});

//Eliminar datos de session
sessionRouter.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.send({ status: "Error", error: error });
    } else {
      res.redirect("http://localhost:8080/views/login");
    }
  });
});

//Ruta privada que solo ven los admin, usando el middleware de autenticacion
sessionRouter.get("/privada", auth, (req, res) => {
  res.send("Info que solo puede ver un admin");
});

module.exports = sessionRouter;
