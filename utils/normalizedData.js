const {normalize, schema} = require("normalizr");

const normalizedData = (data) => {
  const dataJson = JSON.stringify(data);
  const dataParsed = JSON.parse(dataJson);
  console.log(dataParsed);

  const schemaAuthor = new schema.Entity("author", {}, {idAttribute: "id"});

  const schemaMensaje = new schema.Entity("post", {author: schemaAuthor});

  const schemaMensajes = new schema.Entity(
    "posts",
    {mensajes: [schemaMensaje]},
    {idAttribute: "mensajes"}
  );

  const normalizarMensajes = normalize(
    {id: "mensajes", mensajes: dataParsed},
    schemaMensajes
  );

  //

  return normalizarMensajes;
};

module.exports = normalizedData;