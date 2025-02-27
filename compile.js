const { execSync } = require("child_process");
const { MSICreator } = require("electron-wix-msi");
const path = require("path");

function buildAndCompileApp(appName, manufacturer, version, iconPath) {
  const appDirectory = path.resolve(
    __dirname,
    `release-builds/${appName}-win32-x64`
  );
  const outputDirectory = path.resolve(__dirname);
  execSync("npm run preelectron-pack", { stdio: "inherit" });

  // Passo 1: Empacotar o aplicativo Electron
  console.log("Empacotando o aplicativo Electron...");
  execSync(
    `npx electron-packager . ${appName} --platform=win32 --arch=x64 --out=release-builds --overwrite --ignore=node_modules/.cache`,
    { stdio: "inherit" }
  );

  // Passo 2: Instanciar o criador do MSI
  const msiCreator = new MSICreator({
    appDirectory: appDirectory,
    outputDirectory: outputDirectory,
    description: appName,
    exe: appName,
    name: appName,
    manufacturer: manufacturer,
    version: version,
    icon: iconPath,
    ui: {
      chooseDirectory: true,
    },
  });

  // Passo 3: Criar o template .wxs
  console.log("Criando o template .wxs...");
  msiCreator
    .create()
    .then(() => {
      console.log("Template .wxs criado.");

      // Passo 4: Compilar o arquivo .wxs com a extensão WixUtilExtension
      console.log("Compilando o arquivo .wxs...");
      execSync(
        `candle -ext WixUtilExtension -ext WixUIExtension -v "${outputDirectory}/${appName}.wxs"`,
        { stdio: "inherit" }
      );

      // Passo 5: Linkar o arquivo .wixobj gerado com a extensão WixUIExtension
      console.log("Linkando e criando o arquivo MSI...");
      execSync(
        `light -ext WixUtilExtension -ext WixUIExtension -v -out "${outputDirectory}/${appName}.msi" "${outputDirectory}/${appName}.wixobj"`,
        { stdio: "inherit" }
      );

      console.log("Instalador MSI criado com sucesso.");
    })
    .catch((err) => {
      console.error("Erro ao criar o MSI:", err);
    });
}

// Exemplo de uso da função
const appName = "RAVENA";
const manufacturer = "JRRK";
const version = "1.0.0";
const iconPath = path.resolve(__dirname, "ico.ico");
buildAndCompileApp(appName, manufacturer, version, iconPath);
