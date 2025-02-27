const http = require("http");
const app = require("./app");
const morgan = require("morgan");


const PORT = process.env.PORT || 3003;

// Middleware para logs HTTP
app.use(morgan("dev"));
app.set("json spaces", 2);

// Inicializar setup antes de iniciar o servidor
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`🚀 Servidor HTTP rodando na porta ${PORT}`);
  });