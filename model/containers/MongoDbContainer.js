const mongoose = require("mongoose");
const config = require("../../database.config");

(async () => {
  try {
    await mongoose.connect(
      config.mongodb.uri,
      {
        auth: {
          username: config.mongodb.user,
          password: config.mongodb.password,
        },
        authSource: "admin",
      },
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("DB Connected");
  } catch (err) {
    console.log(err);
  }
})();

class MongoDbContainer {
  constructor(name, Schema, collection) {
    this.model = mongoose.model(name, Schema, collection);
  }
  async save(data) {
    try {
      return await this.model.create(data);
    } catch (err) {
      return err;
    }
  }

  async getAll() {
    try {
      let documents = await this.model.find();
      return documents;
    } catch (err) {
      return err;
    }
  }
  async getById(id) {
    try {
      let document = await this.model.findById(id);
      return document;
    } catch (err) {
      return err;
    }
  }

  async deleteById(id) {
    try {
      let document = await this.model.findByIdAndDelete(id);
      return true;
    } catch (err) {
      return err;
    }
  }

  async updateById(id, producto) {
    try {
      let document = await this.model.findByIdAndUpdate(id, producto);
      return document;
    } catch (err) {
      return err;
    }
  }

  async addSubDocToDocumentId(idDoc, subDoc) {
    try {
      await this.model.findByIdAndUpdate(idDoc, {
        $push: { products: subDoc },
      });
    } catch (err) {
      return err;
    }
  }

  async eliminateSubDocIdByDocumentId(idDocument, idSubDoc) {
    try {
      await this.model.findByIdAndUpdate(idDocument, {
        $pull: { products: { _id: idSubDoc } },
      });
    } catch (err) {
      return err;
    }
  }
}

module.exports = MongoDbContainer;
