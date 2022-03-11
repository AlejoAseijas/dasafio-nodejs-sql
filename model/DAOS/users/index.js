const MongoDBContainer = require("../../containers/MongoDbContainer");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Invalid email"],
  },
  password: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});
UserSchema.index({ email: 1 });

class UserDao extends MongoDBContainer {
  constructor() {
    super("user", UserSchema);
  }

  async getByEmail(email) {
    try {
      const document = await this.model.findOne({ email }, { __V: 0 });
      if (!document) {
        const errorMessage = "Usuario o email invalido";
        throw new Error(JSON.stringify({ code: 404, errorMessage }));
      } else {
        return document;
      }
    } catch (error) {
      throw new Error({ code: 500, message: error.message });
    }
  }
}

module.exports = UserDao;
