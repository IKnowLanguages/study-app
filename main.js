const electron = require("electron");
const url = require("url");
const path = require("path");
const { ipcMain } = require("electron");
const { ipcRenderer } = electron;
const { app, BrowserWindow, Menu, IpcMain, Notification } = electron;

require("electron-reloader")(module);

let mainWindow;
let windowForAnswer;

function createWindow() {
  mainWindow = new BrowserWindow({
    title: "Aspire Education",
    titleBarStyle: "hiddenInset",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, "mainWindow.js"),
    },
  });
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "mainWindow.html"),
      protocol: "file:",
      slashes: true,
    })
  );
}

app.on("ready", function () {
  console.log("ready");
  createWindow();
});

function createWindowQuiz() {
  windowForAnswer = new BrowserWindow({
    title: "Quiz",
    titleBarStyle: "hiddenInset",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, "mainWindow.js"),
    },
  });
  windowForAnswer.loadURL(
    url.format({
      pathname: path.join(__dirname, "windowForAnswer.html"),
      protocol: "file:",
      slashes: true,
    })
  );
}

global.questions_ = [];
ipcMain.on("questions", (_, _questions) => {
  console.log(_questions);
  global.questions_.push(_questions[0]);
  global.questions_.push(_questions[1]);
  global.questions_ = global.questions_.filter(function (element) {
    return element !== undefined;
  });
  global.questions_ = [...new Set(global.questions_)];
  console.log("questions =");
  console.log(global.questions_);
});

const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Start Quiz",
        click() {
          createWindowQuiz();
        },
      },
    ],
  },
];

// Add developer tools option if in dev
if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        role: "reload",
      },
      {
        label: "Toggle DevTools",
        accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
    ],
  });
}

menu = Menu.buildFromTemplate(mainMenuTemplate);
Menu.setApplicationMenu(menu);

ipcMain.on("error", function (e, msg) {
  const NOTIFICATION_TITLE = "Warning";
  const NOTIFICATION_BODY = msg;

  new Notification({
    title: NOTIFICATION_TITLE,
    body: NOTIFICATION_BODY,
  }).show();
});
