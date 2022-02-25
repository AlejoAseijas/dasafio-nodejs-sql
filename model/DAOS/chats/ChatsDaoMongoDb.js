const MongoDBContainer = require("../../containers/MongoDbContainer");
const Mongoose = require("mongoose");

const chatSchema = new Mongoose.Schema({
  author: { type: Object, required: true },
  texto: { type: String, required: true },
  timeStamp: { type: Date, default: Date.now },
});

class ChatDaoMongoDB extends MongoDBContainer {
  constructor() {
    super("chats", chatSchema);
  }
}

module.exports = ChatDaoMongoDB;
