// main.js
const { app, BrowserWindow, ipcMain, Tray, Menu } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const url = require("url");

// Polyfills
require("core-js/stable");
require("regenerator-runtime/runtime");

// Guarda as referências para as janelas abertas
let windows = {};
let tray;

// =====================
// FUNÇÃO: Criar Janela
// =====================
/**
 * Cria ou foca uma janela identificada por 'name'
 * @param {string} name Nome único da janela
 * @param {Object} options Opções da janela
 * @param {string} route Rota ou subpath (ex: "resume", "dash", "admin")
 */
function createWindow(name, options, route) {
  if (windows[name]) {
    windows[name].show();
    return;
  }

  windows[name] = new BrowserWindow({
    ...options,
    icon: path.join(__dirname, "ico.png"),
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  // Se estiver em desenvolvimento, usa o servidor local, senão carrega o build
  const loadUrl = isDev
    ? `http://localhost:3000/${route}`
    : url.format({
        pathname: path.join(__dirname, "build", "index.html"),
        protocol: "file:",
        slashes: true,
      }) + `#/${route}`;

  windows[name].loadURL(loadUrl);

  if (isDev) {
    windows[name].webContents.openDevTools({ mode: "detach" });
  }

  // Em vez de fechar, as janelas são escondidas
  windows[name].on("minimize", (event) => {
    event.preventDefault();
    windows[name].hide();
  });

  windows[name].on("close", (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      windows[name].hide();
    } else {
      windows[name] = null;
    }
  });

  windows[name].on("closed", () => {
    windows[name] = null;
  });
}

// =====================
// FUNÇÃO: Criar Bandeja (Tray)
// =====================
function createTray() {
  if (tray) return;

  tray = new Tray(path.join(__dirname, "ico.png"));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open app",
      click: () =>
        createWindow(
          "dash",
          {
            width: 600,
            height: 600,
            transparent: true,
            frame: false,
            alwaysOnTop: true,
          },
          ""
        ),
    },
    {
      label: "Sair",
      click: () => {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip("Meu Aplicativo");
  tray.setContextMenu(contextMenu);

  // Clique na bandeja alterna a visibilidade da janela "dash"
  tray.on("click", () => {
    if (windows["dash"]) {
      windows["dash"].isVisible()
        ? windows["dash"].hide()
        : windows["dash"].show();
    } else {
      createWindow(
        "dash",
        {
          width: 1200,
          height: 950,
          transparent: true,
          frame: false,
          alwaysOnTop: true,
        },
        ""
      );
    }
  });
}


app.on("ready", () => {
  // Cria as janelas iniciais conforme necessário
  createWindow(
    "dash",
    {
      width: 600,
      height: 600,
      transparent: true,
      frame: false,
      alwaysOnTop: true,
    },
    ""
  );


  createTray();
});

app.on("window-all-closed", () => {
  // No macOS normalmente as aplicações permanecem ativas
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // Recria a janela principal se estiver fechada (macOS)
  if (!windows["dash"]) {
    createWindow(
      "dash",
      {
        width: 600,
        height: 600,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
      },
      ""
    );
  }
});
