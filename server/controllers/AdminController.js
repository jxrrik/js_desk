// controllers/AdminController.js
const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://localhost:9200" });

class AdminController {
  static async getDashboardData(req, res) {
    try {
      // Obter dados dos índices usando a API cat.indices
      const indicesResponse = await client.cat.indices({
        format: "json",
        bytes: "b", // tamanho em bytes
      });

      // Suporte para versões onde os dados estão em indicesResponse.body ou direto na resposta
      const indicesData = indicesResponse.body || indicesResponse;
      if (!Array.isArray(indicesData)) {
        throw new Error("Dados de índices inválidos. Esperava um array.");
      }

      // Filtrar índices que não começam com "."
      const indicesFiltrados = indicesData.filter(
        (idx) => idx.index && !idx.index.startsWith(".")
      );

      // Calcular a memória total (em bytes) de todos os índices
      const totalMemoryBytes = indicesFiltrados.reduce((acc, idx) => {
        return acc + (parseInt(idx["store.size"], 10) || 0);
      }, 0);

      // Converter o total de memória para MB (opcional)
      const totalMemoryMB = (totalMemoryBytes / (1024 * 1024)).toFixed(2);

      // Mapear cada índice calculando a porcentagem que ele ocupa do total
      const indices = indicesFiltrados.map((idx) => {
        const docCount = parseInt(idx["docs.count"], 10) || 0;
        const sizeBytes = parseInt(idx["store.size"], 10) || 0;
        const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(2);
        // Calcula a porcentagem com base na memória total
        const memoryPercentage = totalMemoryBytes
          ? Math.floor((sizeBytes / totalMemoryBytes) * 100)
          : 0;
        // Define uma cor, por exemplo, se ocupar mais de 50% do total (exemplo ilustrativo)
        const color = memoryPercentage >= 50 ? "#4CAF50" : "#F44336";
        return {
          name: idx.index,
          documents: docCount,
          size: sizeMB, // tamanho em MB
          memoryPercentage, // porcentagem que esse índice ocupa do total
          color,
        };
      });

      // Obter dados dos projetos a partir do índice "projects"
      let projects = [];
      try {
        const projectsResponse = await client.search({
          index: "projects",
          body: { query: { match_all: {} } },
        });
        const projectsData = projectsResponse.body || projectsResponse;
        projects = projectsData.hits.hits.map((hit) => ({
          id: hit._id,
          name: hit._source.name || hit._id,
          documents: hit._source.documents || 0,
          color: hit._source.color || "#4CAF50",
        }));
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
      }

      // Estatísticas para a top bar
      const totalProjects = projects.length;
      const totalDocuments = indices.reduce(
        (acc, idx) => acc + idx.documents,
        0
      );

      return res.json({
        indices,
        projects,
        stats: {
          totalProjects,
          totalDocuments,
          totalMemory: totalMemoryMB, // total de memória em MB
        },
      });
    } catch (error) {
      console.error("Erro ao obter dados do dashboard:", error);
      return res
        .status(500)
        .json({ error: "Erro ao obter dados do dashboard." });
    }
  }

  static async deleteProject(req, res) {
    const projectId = req.params.id;
    if (!projectId) {
      return res.status(400).json({ error: "ID do projeto não informado." });
    }
    try {
      await client.delete({
        index: "projects",
        id: projectId,
      });
      return res.json({
        message: `Projeto ${projectId} excluído com sucesso!`,
      });
    } catch (error) {
      console.error("Erro ao excluir projeto:", error);
      return res.status(500).json({ error: "Erro ao excluir o projeto." });
    }
  }

  // Adicionando o endpoint para buscar documentos de um índice
  // controllers/AdminController.js

  static async getIndexDocuments(req, res) {
    const indexName = req.params.name;
    const from = parseInt(req.query.from, 10) || 0;
    const size = parseInt(req.query.size, 10) || 20; // 20 é apenas um exemplo

    if (!indexName) {
      return res.status(400).json({ error: "Nome do índice não informado." });
    }

    try {
      const response = await client.search({
        index: indexName,
        body: { query: { match_all: {} } },
        from,
        size,
      });

      const data = response.body || response;
      const hits = data.hits.hits;
      const documents = hits.map((hit) => hit._source);

      // Retornamos também o total de documentos, para sabermos se ainda há mais a buscar
      return res.json({
        documents,
        total: data.hits.total.value, // total de documentos no índice
      });
    } catch (error) {
      console.error("Erro ao obter documentos do índice:", error);
      return res
        .status(500)
        .json({ error: "Erro ao obter documentos do índice." });
    }
  }
}

module.exports = AdminController;
