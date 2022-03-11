const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bCrypt = require("bcrypt");

const UsersDao = require("../../model/DAOS/users/index");
const { formatUserForDB } = require("../../utils/user.utils");


const User = new UsersDao();

const salt = () => bCrypt.genSaltSync(10);
const encrypt = (password) => bCrypt.hashSync(password, salt());
const isValidPassword = (user, password) =>
  bCrypt.compareSync(password, user.password);

passport.use(
  "register",
  new LocalStrategy((username, password, done) => {
    const userObject = {
      email: username,
      password: encrypt(password),
    };
    const newUser = formatUserForDB(userObject);
    User.createData(newUser)
      .then((user) => {
        return done(null, user);
      })
      .catch((error) => {
        console.log("Error en el registro ==> ", error);
        return done(error);
      });
  })
);

passport.use(
  "login",
  new LocalStrategy((username, password, done) => {
    User.getByEmail(username)
      .then((user) => {
        if (!isValidPassword(user, password)) {
          return done(null, false);
        }
        return done(null, user);
      })
      .catch((error) => {
        return done(error);
      });
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.getAllDataOrById(id).then((user) => {
    done(null, user);
  });
});

module.exports = passport;
