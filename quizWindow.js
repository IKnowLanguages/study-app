const electron = require("electron");
const { ipcRenderer } = electron;

ipcRenderer.send("send-the-questions");
global.questions;
ipcRenderer.on("questions-sent", (e, questions) => {
  global.questions = questions;
  if (global.questions.length % 2 == 1) {
    global.questions.pop();
  }
});
console.log(global.questions);

setTimeout(function () {
  console.log(global.questions);
}, 10000);
