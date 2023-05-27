function auth(req, res, next) {
  console.log("auth", req.session);
  if (req.session?.user?.email != "matias" || req.session?.user.role != "admin") {
    console.log(req.session?.user?.first_name);
    console.log(req.session?.user.role);
    return res.status(401).send("Error de autenticacion");
  } else {
    next();
  }
}

module.exports = auth;
