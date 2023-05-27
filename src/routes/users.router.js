const { Router } = require("express");
const { userModel } = require("../models/user.model");
const auth = require("../middlewares/autenticacion.middleware");

const userRouter = Router(); //se instancia y no hace falta usar "new"

//GET async porque se conecta con la base de datos
userRouter.get("/", auth, async (req, res) => {
  try {
    let users = await userModel.find();
    console.log(users);
    res.send({
      status: "success",
      payload: users,
    });
  } catch (error) {
    console.log("get userModel ERROR");
  }
});

//mongoosePaginate
userRouter.get("/paginate", async (req, res) => {
  try {
    //page 1 es por defecto, si no recibe la page
    let { page } = req.query;
    let pagina;
    if (!page) {
      pagina = 1;
    } else {
      pagina = page;
    }

    let users = await userModel.paginate({}, { limit: 10, page: pagina, lean: true });

    //la funcion paginate crea un array llamado docs (users.docs)
    const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = users;
    res.render("users.handlebars", {
      status: "success",
      users: docs,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    });
  } catch (error) {
    console.log("get userModel ERROR", error);
  }
});

//POST
userRouter.post("/", async (req, res) => {
  try {
    let user = req.body; //En el body viene la informacion. Se envia el mensaje en formato JSON dentro del Body y modo "raw".
    if (!user.first_name || !user.last_name || !user.email)
      return res.status(404).send({ status: "Error", mensaje: "Debe completar nombre y apellido en JSON" });
    //usuarios.push(user);

    //userModel necesita que le pasen los parametros especificados en el Schema, con el mismo nombre (osea, first_name, last_name, email)
    const newUser = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    };

    let result = await userModel.create(newUser);
    res.status(200).send({ result });
  } catch (error) {
    console.log("userRouter POST: error", error);
  }
});

//PUT  http://localhost:8080/usuarios/1
userRouter.put("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const user = req.body;
    if (!uid) return res.send({ status: "Error", message: "No existe el uid" });
    if (!user.first_name || !user.last_name || !user.email)
      return res.status(404).send({ status: "Error", mensaje: "Debe completar nombre y apellido en JSON" });

    let userToReplace = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    };

    let result = await userModel.updateOne({ _id: uid }, userToReplace);

    res.status(200).send({ status: "success", payload: result });
  } catch (error) {
    console.log("userRouter PUT: error", error);
  }
});

//DELETE
userRouter.delete("/:uid", async (req, res) => {
  try {
    let { uid } = req.params;
    let result = await userModel.deleteOne({ _id: uid });
    res.status(200).send({ status: "success", payload: result });
  } catch (error) {
    console.log("userRouter DELETE: error", error);
  }
});

//{"first_name":"matho","last_name":"barracchia","email":"mathodstocaresbueno_nintendoquieneres@hotmail.com"}

module.exports = userRouter;
