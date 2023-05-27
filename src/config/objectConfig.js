//Archivo donde se configura mongoose
const { connect } = require("mongoose");

//en la url, luego del ".net./" ponemos el nombre de la base de datos, sino crea por defecto "test"
let urlDB = "mongodb+srv://mguarna:pikachu1@cluster0.zbnzv1a.mongodb.net/DBpruebas?retryWrites=true&w=majority";

module.exports = {
  connectDB: () => {
    connect(urlDB);
    console.log("Base de datos conectada");
  },
};
