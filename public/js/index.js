const socket = io();

const $ = (selector) => document.querySelector(selector);

const button = $("#buttonSend");

console.log(normalizr.schema.Entity);

const deNormalizeData = (data) => {
  const authorSchema = new normalizr.schema.Entity("author", undefined, {
    idAttribute: "email",
  });
  const mensajeSchema = new normalizr.schema.Entity(
    "post",
    { author: authorSchema },
    { idAttribute: "_id" }
  );
  const mensajesSchema = new normalizr.Schema.Entity("posts", {
    messages: [mensajeSchema],
  });

  const denormalizePost = normalizr.denormalize(
    data.result,
    mensajesSchema,
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

  console.log(message);

  socket.emit("incomingMessage", message);
  inputMsj.value = "";
  inputMsj.focus();
};

button.addEventListener("click", (event) => {
  sendMesaage(event, messageForm);
});

socket.on("chat", (messages) => {
  const result = deNormalizeData(messages);
  const compresion = getCompresion(messages, result);

  const texto = result
    .map(({ texto, author }) => {
      return `<li class="list-group-item mt-3"> <span>${
        author.nombre + author.apellido
      }</span> <span class="text-primary fw-bold">${
        author.id
      }</span> <span class="text-success"> [${
        author.alias
      } ]</span> <img src="${
        author.avatar
      }" class"img-fluid img-thumbnail" alt="user avatar" />: ${texto}</li>`;
    })
    .join("");

  $("#messages").innerHTML = texto;
  $("#compresion").innerHTML = compresion;
});

(async () => {
  const productos = await fetch("http://localhost:3000/api/productos", {
    headers: { "Content-Type": "application/json" },
  });

  if (productos.status === 200) {
    const productosJson = await productos.json();

    fetch("http://localhost:3000/template/productos.tpl")
      .then((res) => res.text())
      .then((data) => {
        const template = Handlebars.compile(data);
        const html = template({ productosJson });
        $("#dataProductos").innerHTML = html;
      });
  }
})();
