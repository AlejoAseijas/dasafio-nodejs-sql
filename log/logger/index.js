const log4js = require("log4js");
const path = require("path");
const cwd = process.cwd();

log4js.configure({
  appenders: {
    console: { type: "console" },
    infoFile: {
      type: "file",
      filename: path.join(cwd, "/log/info.log") /**nombre del archivo */,
    },
    warningFiles: { type: "file", filename: path.join(cwd, "/log/warn.log") },
    errorsFile: { type: "file", filename: path.join(cwd, "/log/error.log") },
  },
  categories: {
    default: {
      appenders: ["console"],
      level: "trace",
    },
    console: {
      appenders: ["console"],
      level: "debug",
    },
    infoFile: {
      appenders: ["infoFile"],
      level: "info",
    },
    warningFiles: {
      appenders: ["warningFiles"],
      level: "warn",
    },
    error: {
      appenders: ["console", "errorsFile"],
      level: "error",
    },
  },
});

const logger = log4js.getLogger();
const consoleLogger = log4js.getLogger("console");
const infoLogger = log4js.getLogger("infoFile");
const warnLogger = log4js.getLogger("warningFiles");
const errorLogger = log4js.getLogger("errorsFile");

module.exports = {
  logger,
  consoleLogger,
  infoLogger,
  warnLogger,
  errorLogger,
};
