const { json } = require("express/lib/response");

class DB {
  constructor(options, nameOfTable) {
    this.options = options;
    this.nameOfTable = nameOfTable;
  }

  async save(data) {
    var knex = require("knex")(this.options);
    try {
      await knex(this.nameOfTable).insert(data);
      return true;
    } catch (err) {
      return json({ status: false, data: err });
    } finally {
      knex.destroy();
    }
  }

  async getAllProduct() {
    var knex = require("knex")(this.options);
    let response = [];
    try {
      let productsResponse = await knex.from(this.nameOfTable).select("*");
      productsResponse.map((data) => {
        let structure = {
          title: data.title,
          price: data.price,
          thumbnail: data.thumbnail,
          id: data.id,
        };
        response.push(structure);
      });
      return response;
    } catch (err) {
      return json({ status: false, data: err });
    } finally {
      knex.destroy();
    }
  }

  async getByIdProduct(idProduct) {
    var knex = require("knex")(this.options);
    let response = {};
    try {
      let productsResponse = await knex
        .from(this.nameOfTable)
        .select("*")
        .where({ id: idProduct });
      response = {
        title: productsResponse[0].title,
        price: productsResponse[0].price,
        thumbnail: productsResponse[0].thumbnail,
        id: productsResponse[0].id,
      };
      return response;
    } catch (err) {
      return json({ status: false, data: err });
    } finally {
      knex.destroy();
    }
  }

  async deleteAllProduct() {
    var knex = require("knex")(this.options);
    try {
      await knex(this.nameOfTable).del();
      return true;
    } catch (err) {
      return err;
    } finally {
      knex.destroy();
    }
  }

  async deleteByIdProduct(idProduct) {
    var knex = require("knex")(this.options);
    try {
      await knex(this.nameOfTable).where({ id: idProduct }).del();
      return true;
    } catch (err) {
      return err;
    } finally {
      knex.destroy();
    }
  }

  async getAllMsj() {
    var knex = require("knex")(this.options);
    let response = [];
    try {
      let productsResponse = await knex.from(this.nameOfTable).select("*");
      productsResponse.map((data) => {
        let structure = {
          nombre: data.nombre,
          text: data.text,
        };
        response.push(structure);
      });
      return response;
    } catch (err) {
      return json({ status: false, data: err });
    } finally {
      knex.destroy();
    }
  }
}

const createTableChats = async (options, nameOfTable) => {
  var knex = require("knex")(options);
  try {
    await knex.schema.createTable(nameOfTable, (table) => {
      table.increments("id");
      table.string("nombre").notNullable();
      table.string("text");
    });
    return true;
  } catch (err) {
  } finally {
    knex.destroy();
  }
};

const createTableProducts = async (options, nameOfTable) => {
  var knex = require("knex")(options);
  try {
    await knex.schema.createTable(nameOfTable, (table) => {
      table.string("title", 15).notNullable();
      table.float("price");
      table.string("thumbnail");
      table.increments("id");
    });
    return true;
  } catch (err) {
  } finally {
    knex.destroy();
  }
};

module.exports = { DB, createTableChats, createTableProducts };
