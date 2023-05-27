const { Router } = require("express");

const viewsRouter = Router();

viewsRouter.get("/login", (req, res) => {
  res.render("login", {
    style: "index.css",
  });
});

viewsRouter.get("/register", (req, res) => {
  res.render("registerForm", {
    style: "index.css",
  });
});

viewsRouter.post("/register", (req, res) => {
  //Mismos nombres que los input
  //const { name, email, password } = req.body;
  const user = req.body;
  res.send({
    user,
    mensaje: "Registrado con éxito",
  });
});

//RUTA Y DATOS PARA HANDLEBARS_____________________________
const usersArray = [
  {
    name: "Juan",
    lastname: "Gonzalez",
    edad: 25,
    mail: "jgonz@gmail.com",
    telefono: "123-123-1",
  },
  {
    name: "Pedro",
    lastname: "Falopa",
    edad: 31,
    mail: "pfalopa@gmail.com",
    telefono: "784-213-6",
    role: "admin",
  },
  {
    name: "Francisco",
    lastname: "Narvo",
    edad: 19,
    mail: "fnarvo@gmail.com",
    telefono: "146-733-1",
    role: "user",
  },
  {
    name: "Susana",
    lastname: "Ortiz",
    edad: 28,
    mail: "sortiz@gmail.com",
    telefono: "145-465-2",
    role: "admin",
  },
];

let food = [
  {
    name: "Hamburguesa",
    price: 750,
  },
  {
    name: "Coca feca",
    price: 1000,
  },
  {
    name: "Papitas",
    price: 500,
  },
];

//Defino una ruta
viewsRouter.get("/", (req, res) => {
  //Elegir un user random
  let userhbs = usersArray[Math.floor(Math.random() * usersArray.length)];
  let testUser2 = {
    title: "E-commerce PAPAAA",
    userhbs,
    isAdmin: userhbs.role == "admin",
    food,
    style: "index.css",
  };

  //Brindamos los datos a renderizar
  // let testUser = {
  //   name: "Matias",
  //   lastname: "Guarna",
  //   title: "E-commerce",
  // };

  res.render("index.handlebars", testUser2);
});

viewsRouter.get("/chat", (req, res) => {
  res.render("chat.handlebars", {});
});

module.exports = viewsRouter;
