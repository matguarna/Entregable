const jwt = require("jsonwebtoken");
const JWT_PRIVATE_KEY = "palabraJwtSecreta";

//Genera el token de un usuario, sin datos sensibles
const generateToken = (user) => {
  const token = jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: "1d" });
  return token;
};

//middleware que Verifica si ambos token coinciden
const authToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).send({ status: "Error", error: "authToken: No autenticado" });
  }

  //el token viene en la posicion 1 de authHeader
  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_PRIVATE_KEY, (error, credencial) => {
    //Guarda en credencial el token
    if (error) return res.status(403).send({ status: "error", error: "authToken: No autorizado" });
    req.user = credencial.user;
    next();
  });
};

module.exports = {
  generateToken,
  authToken,
};
