//Construimos el schema para dar una estructura para tiparlo
const { Schema, model } = require("mongoose");

//Importamos mongoose-paginate
const mongoosePaginate = require("mongoose-paginate-v2");

const collection = "usuarios";

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  gender: String,
  password: { type: String, required: true },
  username: {
    type: String,
    required: true,
    unique: true,
    index: true, //agregamos un indice para disminuir el tiempo de busqueda
  },
});

//le agregamos el plugin al modelo
userSchema.plugin(mongoosePaginate);

//Se pasa por parametro la coleccion y schema. Se configura el objeto userModel con las propiedades configuradas arriba
const userModel = model(collection, userSchema);

module.exports = {
  userModel,
};
