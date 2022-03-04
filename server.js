const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
const path = require("path");
const routes = require("./router/routes");
require("dotenv").config();
const chatDao = require("./model/DAOS/index");
const normalizedData = require("./utils/normalizedData");
const config = require("./database.config");
//
const session = require("express-session");
const MongoStore = require("connect-mongo");
//
app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: MongoStore.create({ mongoUrl: config.mongodb.uri }),
    secret: "ÑsecretÑ",
    saveUninitialized: false,
    resave: false,
    rolling: true,
    cookie: {
      maxAge: 60000,
    },
  })
);

app.set("view engine", "ejs");

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
  socket.on("incomingMessage", async (message) => {
    emitir();
    if (message) {
      await chatDao.createData(message);
      emitir();
    }
  });
});

server.listen(3000, () => {
  console.log(`Running on port: ${3000}`);
});
