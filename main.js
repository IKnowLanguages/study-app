const electron = require("electron");
const url = require("url");
const path = require("path");
const { ipcMain } = require("electron");
const { ipcRenderer } = electron;
const { app, BrowserWindow, Menu, IpcMain, Notification } = electron;
const Store = require("electron-store");

let store = new Store();
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
  mainWindow.on("close", function () {
    app.quit();
  });
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
      preload: path.join(__dirname, "quizWindow.js"),
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

global.questions_ = store.get("unicorn");
ipcMain.on("questions", (_, _questions) => {
  console.log(1, _questions);
  global.questions_.push(_questions[0]);
  global.questions_.push(_questions[1]);
  global.questions_ = global.questions_.filter(function (element) {
    return element !== undefined;
  });
  global.questions_ = [...new Set(global.questions_)];
  console.log("questions =");
  console.log(global.questions_);
  store.set("unicorn", global.questions_);
  console.log(store.get("unicorn"));
});

const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Start Quiz",
        click() {
          if (global.questions_.length > 0) {
            createWindowQuiz();
            ipcMain.on("send-the-questions", (e) => {
              e.reply("questions-sent", global.questions_);
            });
          } else {
            new Notification({
              icon: "logo.png",
              silent: false,
              urgency: "low",
              hasReply: false,
              closeButtonText: "ok",
              title: "warning",
              body: "Can't open quiz window without inputting questions",
            }).show();
          }
        },
      },
      {
        label: "Clear All Questions",
        click() {
          global.questions_ = [];
          store.set("unicorn", global.questions_);
          console.log(store.get("unicorn"));
        },
      },
      {
        label: "Start Quiz In Window",
        role: "reload",
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
    icon: "logo.png",
    silent: false,
    urgency: "low",
    hasReply: false,
    closeButtonText: "ok",
    title: NOTIFICATION_TITLE,
    body: NOTIFICATION_BODY,
  }).show();
});

ipcMain.on("msssg", (e, msg) => {
  console.log(12345, msg);
});

ipcMain.on("abc", (e) => {
  e.reply("reply");
});

ipcMain.on("item", (_, item) => {
  console.log(123, item);
});

app.on("quit", () => {
  app.quit();
});
