const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
const path = require("path");
const routes = require("./router/routes");
require("dotenv").config();

app.use(express.static(__dirname + "./public"));

app.use("/api", routes);

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/index.html"));
});

app.get("/productos-test", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/products-template-test.html"));
});

const emitir = () => {
  const mensaje = db.getAllMsj();
  mensaje.then((data) => {
    io.sockets.emit("chat", data);
  });
};

io.on("connection", (socket) => {
  emitir();

  socket.on("incomingMessage", (message) => {
    emitir();
    if (message.nombre) {
      db.save(message);
      emitir();
    }
  });
});

server.listen(3000, () => {
  console.log(`Running on port: ${3000}`);
});
