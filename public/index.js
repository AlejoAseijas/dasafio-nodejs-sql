const socket = io();

socket.on("onLoad", (productos) => {
  fetch("http://localhost:3000/template/productos.tpl")
    .then((res) => res.text())
    .then((data) => {
      const template = Handlebars.compile(data);
      const html = template({ productos });
      document.getElementById("dataProductos").innerHTML = html;
    });
});

function sendMessage() {
  const message = {
    nombre: document.getElementById("nombre").value,
    text: document.getElementById("mensaje").value,
  };

  socket.emit("incomingMessage", message);
  document.getElementById("mensaje").value = "";
  document.getElementById("mensaje").focus();
}

socket.on("chat", (messages) => {
  const texto = messages
    .map((mensaje) => {
      return `<div>
    <strong>${mensaje.nombre}</strong>:
    <em>${mensaje.text}</em>
    </div>`;
    })
    .join(" ");

  document.getElementById("messages").innerHTML = texto;
});
