const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
const path = require("path");
const routes = require("./router/routes");
require("dotenv").config();
const { engine } = require("express-handlebars");
const chatDao = require("./model/DAOS/index");
const normalizedData = require("./utils/normalizedData");

app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
  "handlebars",
  engine({
    extname: "hbs",
    defaultLayout: "main.hbs",
    layoutsDir: path.resolve(__dirname, "./views/layouts"),
    partialsDir: path.resolve(__dirname, "./views/partials"),
  })
);

app.set("views", "./views");
app.set("view engine", "handlebars");

app.use("/api", routes);

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/index.html"));
});

app.get("/productos-test", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/products-template-test.html"));
});

const emitir = async () => {
  const msj = await chatDao.getAllDataOrById();
  const normalizedMsj = normalizedData(msj);
  io.sockets.emit("chat", normalizedMsj);
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
