const fs = require("fs").promises;
const path = require("path");

const MAX_FILE_SIZE = 500 * 1024; // 500 KB (ajuste conforme necessário)

async function getAllFiles(
  dirPath,
  arrayOfFiles = [],
  exclude = [],
  tree = [],
  level = 0
) {
  const files = await fs.readdir(dirPath);

  for (const file of files) {
    // Verifica se o arquivo ou pasta contém alguma das strings no array exclude
    if (exclude.some((str) => file.includes(str))) continue;

    const filePath = path.join(dirPath, file);
    const stat = await fs.stat(filePath);

    const indent = "  ".repeat(level);
    tree.push(`${indent}- ${file}`);

    if (stat.isDirectory()) {
      await getAllFiles(filePath, arrayOfFiles, exclude, tree, level + 1);
    } else {
      // Filtra apenas arquivos de código e configuráveis
      if (isValidFile(file, stat)) {
        arrayOfFiles.push(filePath);
      }
    }
  }

  return { arrayOfFiles, tree };
}

function isValidFile(file, stat) {
  const validExtensions = [
    ".js",
    ".json",
    ".md",
    ".yml",
    ".yaml",
    ".toml",
    ".env",
    ".ts",
    ".tsx",
    ".html",
    ".css",
    ".scss",
    ".py",
    ".sh",
    ".bat",
  ];

  const invalidExtensions = [
    ".ico",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".bmp",
    ".tiff",
    ".mp3",
    ".mp4",
    ".avi",
    ".mkv",
    ".mov",
    ".wav",
    ".zip",
    ".rar",
    ".7z",
    ".gz",
    ".tar",
    ".pdf",
    ".docx",
    ".xlsx",
    ".exe",
    ".dll",
    ".pfx",
    ".pem",
    ".key",
    ".log",
  ];

  const ext = path.extname(file).toLowerCase();
  if (invalidExtensions.includes(ext)) return false;

  // Apenas arquivos importantes
  if (!validExtensions.includes(ext)) return false;

  // Ignora arquivos muito grandes
  if (stat.size > MAX_FILE_SIZE) return false;

  return true;
}

async function generateOutputFile(dirPath, outputFilePath, exclude) {
  try {
    const { arrayOfFiles, tree } = await getAllFiles(dirPath, [], exclude);
    const outputStream = await fs.open(outputFilePath, "w");

    // Escreve a árvore de arquivos no início do arquivo de saída
    await outputStream.write(`\n=== Árvore de Arquivos ===\n`);
    await outputStream.write(`${tree.join("\n")}\n`);

    // Escreve o conteúdo de cada arquivo
    for (const file of arrayOfFiles) {
      const relativePath = path.relative(dirPath, file);
      const fileContent = await fs.readFile(file, "utf-8");

      await outputStream.write(`\n\n=== ${relativePath} ===\n`);
      await outputStream.write(`${fileContent}\n`);
    }

    await outputStream.close();
    console.log(`Arquivo de saída gerado com sucesso em: ${outputFilePath}`);
  } catch (error) {
    console.error(`Erro ao gerar o arquivo de saída: ${error.message}`);
  }
}

// Caminho do diretório que você deseja processar
const dirPath = path.join(
  __dirname,
  "../",
  "src"
);
const exclude = [
  "cert",
  "output",
  ".git",
  "node_modules",
  "logs",
  "pfx",
  "pem",
  "key",
  "package-lock",
  "dist",
  "build",
  ".vscode",
  ".idea",
];

// Caminho do arquivo de saída
const outputFilePath = path.join(__dirname, "output.txt");

generateOutputFile(dirPath, outputFilePath, exclude);
