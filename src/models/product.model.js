const { Schema, model } = require("mongoose");

//Importamos mongoose-paginate
const mongoosePaginate = require("mongoose-paginate-v2");

const collection = "productos";

const productSchema = new Schema({
  title: { type: String, required: true },
  descripcion: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  code: { type: String, required: true, unique: true },
});

//le agregamos el plugin al modelo
productSchema.plugin(mongoosePaginate);
const productModel = model(collection, productSchema);

module.exports = {
  productModel,
};
