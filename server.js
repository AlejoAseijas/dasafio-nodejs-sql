const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
const path = require("path");
const { engine } = require("express-handlebars");
const { getAll, postProduct } = require("./Controller/productos");
const configKnexMysql = {
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "ecommerce",
  },
  pool: { min: 0, max: 7 },
};
const configSqlLite = {
  client: "sqlite3",
  connection: { filename: "./DB/ecommerce.sqlite" },
};
const {
  DB,
  createTableChats,
  createTableProducts,
} = require("./model/db.model");
const db = new DB(configSqlLite, "chats");

createTableProducts(configKnexMysql, "productos");
createTableChats(configSqlLite, "chats");

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

app.get("/productos", getAll);

app.post("/productos", postProduct);

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
