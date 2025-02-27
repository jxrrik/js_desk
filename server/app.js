require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

class AppController {
  constructor() {
    this.express = express();
    this.express.use(cors());
    this.express.use(bodyParser.json({ limit: "30gb" }));
    this.express.use(bodyParser.urlencoded({ extended: true, limit: "30gb" }));
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.express.use(express.json());
  }

  routes() {
    this.express.use("/", require("./routes"));
  }
}

module.exports = new AppController().express;
