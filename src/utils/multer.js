//Otro middle de 3ros: Multer, sirve para cargar archivos al servidor: npm i multer
const multer = require("multer");
const { dirname } = require("path");

//el diskStorage configura el destino de donde queremos guardar y su nombre
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, `${dirname(__dirname)}/public/uploads`);
  },
  filename: function (req, file, callback) {
    console.log("file: ", file);
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploader = multer({
  storage,
  onError: function (err, next) {
    console.log(err);
    next(err);
  },
});

module.exports = { uploader };
