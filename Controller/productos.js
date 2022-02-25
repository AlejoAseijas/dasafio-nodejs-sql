const MockData = require("../model/mocks/products");
const productsMock = new MockData("producto");
const getAll = async (req, res) => {
  try {
    const data = await db.getAllProduct();
    res.render("index", { tableProducts: true, products: data });
  } catch (err) {
    res.status(402).json({ err: "error al traer datos" });
  }
};

const postProduct = async (req, res) => {
  try {
    let data = await db.save(req.body);
    res.status(201).redirect("/productos");
  } catch (err) {
    res.status(402).json({ err: "error al guardar datos" });
  }
};

module.exports = { getAll, postProduct };
