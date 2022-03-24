const express = require("express");
const router = express.Router();
const { mockProductController } = require("../Controller/productos");
const path = require("path");
const { authWeb } = require("../middleware/auth/index");
const passport = require("../middleware/auth/passport");
const { fork } = require("child_process");
const getRandomController = require("../Controller/random.controller");
router.get("/", (req, res) => {
  res.redirect("/home");
});

router.get("/login", (req, res) => {
  const name = req.session?.name;
  if (name) {
    res.redirect("/");
  } else {
    res.sendFile(path.join(process.cwd(), "/public/views/login.html"));
  }
});

router.get("/logout", (req, res) => {
  const name = req.session?.name;
  if (name) {
    req.session.destroy((err) => {
      if (!err) {
        res.render(path.join(process.cwd(), "/public/views/logout.ejs"), {
          name,
        });
      } else {
        res.redirect("/");
      }
    });
  } else {
    res.redirect("/");
  }
});

router.get("/register", (req, res) => {
  const name = req.user;
  if (name) {
    res.redirect("/");
  } else {
    res.sendFile(path.join(process.cwd(), "/public/views/register.html"));
  }
});

router.get("/loginError", (req, res) => {
  const error = "Credenciales no validas";
  res.render("error.ejs", { error });
});

router.get("registerError", (req, res) => {
  const error = "Usuario ya registrado";
  req.render("error.ejs", { error });
});

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "registerError" }),
  (req, res) => {
    res.redirect("/home");
  }
);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/loginError" }),
  (req, res) => {
    res.redirect("/home");
  }
);

router.get("/home", authWeb, (req, res) => {
  res.render(path.join(process.cwd(), "/public/views/index.ejs"), {
    name: req.session.name,
  });
});

router.get("/home/productos-test", authWeb, (req, res) => {
  res.sendFile(path.join(process.cwd(), "/public/productos-test.html"));
});

router.get("/productos-test", mockProductController);

router.get("/info", (req, res) => {
  const info = {
    directorio: process.cwd(),
    memory: process.memoryUsage(),
    processId: process.pid,
    node: process.version,
    os: process.platform,
    inputArgs: process.argv,
    path: process.execPath,
  };
  res.render("info.ejs", { info });
});

router.get("/random/:quantity?", getRandomController);

module.exports = router;
