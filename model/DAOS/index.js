let chats;
const dotenv = require("dotenv");
dotenv.config("../../.env");

switch (process.env.DATA_SOURCE) {
  case "mongodb":
    const ChatDaoMongoDB = require("./chats/ChatsDaoMongoDb");
    chatDao = new ChatDaoMongoDB();
    break;
}
