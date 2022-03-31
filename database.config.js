const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });
module.exports = {
  mongodb: {
    uri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mlaj3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  },
};
