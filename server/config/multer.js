// config/multer.js
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const BASE_DIR = "C:/Ravena";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Captura o 'project' a partir da rota (ex.: /speds/:project)
    const { project } = req.params;

    // Se não tiver project na rota, podemos salvar direto no BASE_DIR,
    // ou gerar um erro, dependendo da sua regra de negócio.
    if (!project) {
      console.warn(
        "Parâmetro 'project' não encontrado. Salvando em:",
        BASE_DIR
      );
      return cb(null, BASE_DIR);
    }

    // Caso tenha 'project', salvamos em <BASE_DIR>/<project>/speds
    const finalDir = path.join(BASE_DIR, project, "speds");

    // Criar diretório se não existir
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }

    return cb(null, finalDir);
  },

  filename: (req, file, cb) => {
    // Mantém o nome original
    cb(null, file.originalname);
  },
});

module.exports = multer({ storage });
