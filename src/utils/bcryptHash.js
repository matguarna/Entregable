const bcrypt = require("bcrypt");

//func para crear el hash
exports.createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10)); //Genera la llave de encriptacion, cuanto mayor el numero, mayor encriptacion

//func para comprar passwords
exports.isValidPassword = (password, user) => {
  const validado = bcrypt.compareSync(password, user.password);
  return validado;
};

//Se pueden exportar directamente sin module.export
