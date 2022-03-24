const { fork } = require("child_process");

const getRandomController = async (req, res, next) => {
  let cant = 100000000;

  if (req.query.quantity) {
    cant = req.query.quantity;
  }
  const computo = fork("./utils/randomNumber");
  computo.send(cant);
  computo.on("message", (value) => {
    res.status(200).json(value);
  });
};

module.exports = getRandomController;
