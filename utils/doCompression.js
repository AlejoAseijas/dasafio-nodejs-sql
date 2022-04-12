const compression = require("compression");

const doCompression = (req, res, next) => {
  const validate = req.params.compress || false;

  if (validate) {
    compression();
    next();
  }
  next();
};

module.exports = doCompression;
