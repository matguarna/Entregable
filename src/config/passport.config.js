const passport = require("passport");
const passportlocal = require("passport-local");
const { userModel } = require("../models/user.model");
const { createHash, isValidPassword } = require("../utils/bcryptHash");
const GithubStrategy = require("passport-github2");
const LocalStrategy = passportlocal.Strategy;
require("dotenv").config(); //Importamos dotenv para usar el archivo .env

const initPassport = () => {
  //es un middleware. configuracion del registro
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email", //disfraza el campo obligatorio "username" por "email"
      },
      async (req, username, password, done) => {
        const { first_name, last_name } = req.body;
        try {
          let userDB = await userModel.findOne({ email: username });

          if (userDB) return done(null, false);

          const newUser = {
            first_name,
            last_name,
            username: req.body.username,
            email: username,
            password: createHash(password),
          };
          let result = await userModel.create(newUser);

          return done(null, result);
        } catch (error) {
          return done("Error al obtener el usuario", error);
        }
      }
    )
  );
};

//Para guardar el ID de la sesion del usuario
passport.serializeUser((user, done) => {
  done(null, user._id);
});

//Trae el id del usuario
passport.deserializeUser(async (id, done) => {
  let user = await userModel.findOne({ _id: id });
  done(null, user);
});

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (username, password, done) => {
      try {
        const userDB = await userModel.findOne({ email: username });
        console.log("Encontre el USERDB en passport");
        console.log(userDB);
        if (!userDB) return done(null, false);

        if (!isValidPassword(password, userDB)) return done(null, false);

        return done(null, userDB);
      } catch (error) {
        return done(error);
      }
    }
  )
);

const initPassportGithub = () => {
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.3d5fae0b836c63e2", //process.env.GITHUB_CLIENT_ID,
        clientSecret: "bafb8d940aacac768f2e7dc23e99277ef9c44c50", //process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/session/githubcallback", //process.env.GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("Profile:", profile);
        try {
          let userDB = await userModel.findOne({ email: profile._json.email });
          //if (userDB)

          if (!userDB) {
            const newUser = {
              first_name: profile.username,
              last_name: profile.username,
              username: profile.username,
              email: "pruebamail@gmail.com", //profile._json.email,
              password: "123",
            };
            let result = await userModel.create(newUser);
            return done(null, result);
          }
          return done(null, userDB);
        } catch (error) {
          console.log("Github strategy Error", error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findOne({ _id: id });
    done(null, user);
  });
};

module.exports = {
  initPassport,
  initPassportGithub,
};
