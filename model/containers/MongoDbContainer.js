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

class MongoDBContainer {
  constructor(collection, schema) {
    this.model = mongoose.model(collection, schema);
  }

  async createData(data) {
    try {
      const dataComplete = { timeStamp: Date.now(), ...data };
      return await this.model.create(dataComplete);
    } catch (error) {
      throw new Error(`No se pudo guardar: ${error}`);
    }
  }

  async getAllDataOrById(id) {
    try {
      if (id) {
        const result = await this.model.findById(id);

        if (!result) {
          throw new Error(`No se encontro el documento con id: ${id}`);
        }
        return result;
      }

      return await this.model.find({}, { _id: 0, __v: 0 });
    } catch (error) {
      throw new Error(`Error al obtener todos los datos: ${error}`);
    }
  }

  async updateData(id, data) {
    try {
      const dataUpdate = await this.model.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!dataUpdate) {
        throw new Error(`No se encontro información con id: ${id}`);
      }
      return dataUpdate;
    } catch (error) {
      throw new Error(`Error al actualizar: ${error}`);
    }
  }

  async deleteData(id) {
    try {
      await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`No se pudo eliminar: ${error}`);
    }
  }
}

module.exports = MongoDBContainer;
