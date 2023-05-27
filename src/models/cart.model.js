const { Schema, model } = require("mongoose");

const collection = "carritos";

const cartSchema = new Schema({
  //email: String,
  products: [
    {
      product: {
        type: Schema.Types.ObjectId, //hace referencia al id del objeto
        ref: "productos", //coleccion de referencia
      },
      quantity: Number,
    },
  ],
});

//pre() es un middleware de mongoose que puede definir el populate en el Schema para el método findOne. Trae los datos del producto por su id, desde la coleccion "productos"
cartSchema.pre("findOne", function () {
  this.populate("products.product");
});

const cartModel = model(collection, cartSchema);

module.exports = {
  cartModel,
};
