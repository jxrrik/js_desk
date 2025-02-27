// src/routes.js
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

function getRoute(str) {
  const routePath = path.join(__dirname, "routes", str);
  if (fs.existsSync(`${routePath}.js`)) {
    return require(routePath);
  } else {
    console.error(`Rota não encontrada: ${routePath}`);
    return null;
  }
}

function setRouter(str) {
  try {
    const route = getRoute(str);
    if (route) {
      router.use(`/${str}`, route);
    }
  } catch (e) {
    console.log(e);
    console.error(`Erro ao definir rota: ${str}`);
  }
}

const routes = fs
  .readdirSync(path.join(__dirname, "routes"))
  .map((obj) => obj.replace(".js", ""));

routes.forEach((route) => setRouter(route));

module.exports = router;
