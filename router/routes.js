const express = require("express");
const router = express.Router();
const { mockProductController } = require("../Controller/productos");
const path = require("path");
const { authWeb } = require("../middleware/auth/index");
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

router.post("/logIn", (req, res) => {
  req.session.name = req.body.name;
  res.redirect("/home");
});

router.get("/home", authWeb, (req, res) => {
  res.render(path.join(process.cwd(), "/public/views/index.ejs"), {
    name: req.session.name,
  });
});

router.get("/home/productos-test", authWeb, (req, res) => {
  res.sendFile(path.join(process.cwd(), "/public/productos-test.html"));
});

router.get("/productos-test", mockProductController);

module.exports = router;
