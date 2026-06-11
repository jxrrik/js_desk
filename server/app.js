require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

class AppController {
  constructor() {
    this.express = express();
    this.express.set("json spaces", 2);
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.express.use(morgan("dev"));
    this.express.use(cors());
    this.express.use(express.json({ limit: "30gb" }));
    this.express.use(express.urlencoded({ extended: true, limit: "30gb" }));
  }

  routes() {
    this.express.use("/", require("./routes"));
  }
}

module.exports = new AppController().express;
