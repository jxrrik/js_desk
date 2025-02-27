// routes/admin.js
const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");

// Endpoint para obter os dados do dashboard (índices, projetos e estatísticas)
router.get("/dashboard", AdminController.getDashboardData);

// Endpoint para excluir um projeto (passando o id do projeto na URL)
router.delete("/project/:id", AdminController.deleteProject);

// Endpoint para buscar documentos de um índice (por nome)
router.get("/index/:name", AdminController.getIndexDocuments);

module.exports = router;
