const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

const log4js = require("log4js");
const { warnLogger, errorLogger, infoLogger } = require("./log/logger/index");

const routes = require("./router/routes");
require("dotenv").config();
const chatDao = require("./model/DAOS/index");
const normalizedData = require("./utils/normalizedData");
const config = require("./database.config");
const { PORT, MODE } = require("./port.config");

//
const session = require("express-session");
const MongoStore = require("connect-mongo");
//

const passport = require("./middleware/auth/passport");

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

app.use(
  log4js.connectLogger(infoLogger, {
    level: "info",
    statusRules: [{ from: 200, to: 299, level: "info" }],
  })
);
app.use(
  log4js.connectLogger(warnLogger, {
    level: "warn",
    statusRules: [{ codes: [404], level: "warn" }],
  })
);
app.use(
  log4js.connectLogger(errorLogger, {
    level: "error",
    statusRules: [{ codes: [400], level: "error" }],
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.set("views", "./views");
app.set("view engine", "ejs");

app.use("/", routes);

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

if (MODE === "cluster") {
  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    server.listen(PORT, () => {
      console.log(
        `Escuchando en el puerto ${PORT}`,
        `Worker ${process.pid} started`
      );
    });
  }
} else {
  server.listen(PORT, () => {
    console.log(
      `Escuchando en el puerto ${PORT}`,
      `Worker ${process.pid} Fork`
    );
  });
}
