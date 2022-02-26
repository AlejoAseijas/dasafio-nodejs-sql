const express = require("express");
const router = express.Router();
const { mockProductController } = require("../Controller/productos");

router.get("/productos-test", mockProductController);

module.exports = router;
