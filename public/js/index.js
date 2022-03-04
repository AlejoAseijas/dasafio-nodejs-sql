const socket = io();

const $ = (selector) => document.querySelector(selector);

const button = $("#buttonSend");
const btnLogOut = $("#btn-logOut");

btnLogOut.addEventListener("click", () => {
  window.location.href = "/logout";
});

const deNormalizeData = (data) => {
  const schemaAuthor = new normalizr.schema.Entity(
    "author",
    {},
    { idAttribute: "id" }
  );

  const schemaMensaje = new normalizr.schema.Entity(
    "post",
    { author: schemaAuthor },
    { idAttribute: "_id" }
  );

  const schemaMensajes = new normalizr.schema.Entity(
    "posts",
    { mensajes: [schemaMensaje] },
    { idAttribute: "id" }
  );

  const denormalizePost = normalizr.denormalize(
    data.result,
    schemaMensajes,
    data.entities
  );

  return denormalizePost;
};

const getCompresion = (item, item2) => {
  const length1 = JSON.stringify(item).length;
  const length2 = JSON.stringify(item2).length;
  const compresion = `${Math.round((length1 / length2) * 100).toFixed(2)}`;

  return compresion;
};

const messageForm = {
  inputMsj: $("#inputMensaje"),
  inputNombre: $("#inputNombre"),
  inputApellido: $("#inputApellido"),
  inputEdad: $("#inputEdad"),
  inputAlias: $("#inputAlias"),
  inputAvatar: $("#inputAvatar"),
  inputEmail: $("#inputEmail"),
};

const sendMesaage = (e, formInputs) => {
  e.preventDefault();
  const {
    inputMsj,
    inputNombre,
    inputApellido,
    inputEdad,
    inputAlias,
    inputAvatar,
    inputEmail,
  } = formInputs;

  const message = {
    author: {
      id: inputEmail.value,
      nombre: inputNombre.value,
      apellido: inputApellido.value,
      edad: inputEdad.value,
      alias: inputAlias.value,
      avatar: inputAvatar.value,
    },

    texto: inputMsj.value,
  };
  socket.emit("incomingMessage", message);
  inputMsj.value = "";
  inputMsj.focus();
};

button.addEventListener("click", (event) => {
  sendMesaage(event, messageForm);
});

const separateObject = (obj) => {
  const res = [];
  const keys = Object.keys(obj);

  keys.forEach((key) => {
    res.push({
      [key]: obj[key],
    });
  });
  return res;
};

socket.on("chat", (messages) => {
  const result = deNormalizeData(messages);
  const compresion = getCompresion(messages, result);
  const arrayMensajes = separateObject(result);
  const texto = arrayMensajes
    .map((mensaje, index) => {
      return `<li class="list-group-item mt-3"> <span>${
        mensaje[index].author.nombre
      } ${
        mensaje[index].author.apellido
      }</span> <span class="text-primary fw-bold">
      ${mensaje[
        index
      ].timeStamp.toLocaleString()}}</span> <span class="text-success"> [Alias: ${
        mensaje[index].author.alias
      } ]</span> <img src="${
        mensaje[index].author.avatar
      }" class"img-fluid img-thumbnail" alt="user avatar" />: ${
        mensaje[index].texto
      }</li>`;
    })
    .join("");

  $("#messages").innerHTML = texto;
  $("#compresion").innerText = `Porcentaje de compresion: %${compresion}`;
});

(async () => {
  const productos = await fetch("http://localhost:3000/api/productos-test", {
    headers: { "Content-Type": "application/json" },
  });

  if (productos.status === 200) {
    const productosJson = await productos.json();

    fetch("http://localhost:3000/template/products.tpl")
      .then((res) => res.text())
      .then((data) => {
        const template = Handlebars.compile(data);
        const html = template({ productosJson });
        $("#dataProductos").innerHTML = html;
      });
  }
})();
