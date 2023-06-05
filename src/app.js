const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store");
const { create } = require("connect-mongo");
const cookieParser = require("cookie-parser");
const objectConfig = require("./config/objectConfig");
const { uploader } = require("./utils/multer");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const routerApp = require("./routes/routerApp"); //Agrupador de rutas
const pruebasRouter = require("./routes/pruebas.router.js"); //Cookies
const { initPassport, initPassportGithub } = require("./config/passport.config"); //Importamos initPassport
const passport = require("passport"); //Importamos passport
//__________________________________________________________________
const app = express();
const PORT = 8080; //|| process.env.PORT;
const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando puerto ${PORT}`);
});

const io = new Server(httpServer);

//MONGOOSE : Se conecta a la DB
objectConfig.connectDB();

//__________________________________________________________________
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//handlebars_______________________________________________
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//express______________________________________________
app.use("/static", express.static(__dirname + "/public"));

//file-session-store________________ (se le suma la config de express-session)
const fileStore = FileStore(session);

//Crea una carpeta y guarda las sessiones dentro
// app.use(
//   session({
//     store: new fileStore({
//       ttl: 100000 * 60, //tiempo de vida de la sesion
//       path: __dirname + "/session", //ruta para que se guarde el archivo que se genera con las sesiones
//       retries: 0, //tiempo que va a intentar reconectarse si pasa algo
//     }),
//     secret: "palabraSecreta", //Para firmar las sesiones
//     resave: true, //Permite tener una sesion activa
//     saveUninitialized: true, //Permite guardar cualquier tipo de sesion
//   })
// );

//Session y connect-mongo_________________________
app.use(
  session({
    store: create({
      mongoUrl: "mongodb+srv://mguarna:pikachu1@cluster0.zbnzv1a.mongodb.net/DBpruebas?retryWrites=true&w=majority", //link de la DB
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 100000 * 10, //tiempo de vida de la sesion
    }),
    secret: "palabraSecreta", //Para firmar las sesiones
    resave: false,
    saveUninitialized: false,
  })
);

//express-session_______________________________
// app.use(
//   session({
//     secret: "palabraSecreta", //Para firmar las sesiones
//     resave: true, //Permite tener una sesion activa
//     saveUninitialized: true, //Permite guardar cualquier tipo de sesion
//   })
// );

//cookieparser______________________________________________
app.use(cookieParser("3NCR1PT4D4")); //3NCR1PT4D4 = Firma de la cookie
app.use("/pruebas", pruebasRouter);

//multer______________________________________________
app.post("/single", uploader.single("myFile"), (req, res) => {
  res.status(200).send({
    status: "success",
    message: "El archivo se subió correctamente",
  });
});

//socket.io____________________________________
messages = [];

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  //Socket que recibe el msj
  socket.on("message", (data) => {
    messages.push(data);
    io.emit("messageLogs", messages);
  });
  //Socket de auth
  socket.on("authenticated", (data) => {
    socket.broadcast.emit("newUserConnected", data);
  });
});

//passport_____________________________________
initPassport(); //config del middleware
initPassportGithub();
passport.use(passport.initialize());
passport.use(passport.session());

app.use(routerApp);
