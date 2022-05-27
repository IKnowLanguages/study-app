const electron = require("electron");
const url = require("url");
const path = require("path");
const { ipcMain, ipcRenderer } = require("electron");

global.questions = [];

function Submit(todo) {
  if (todo == 1) {
    let question = document.getElementById("question").value;
    let answer = document.getElementById("answer").value;
    question = question.replace(/\s+/g, " ");
    answer = answer.replace(/\s+/g, " ");
    if (question.trim() == "" || answer.trim() == "") {
      ipcRenderer.send("error", "question or answer field cannot be empty");
      setTimeout(() => {
        document.getElementById("question").value = "";
        document.getElementById("answer").value = "";
      }, 5000);
    } else {
      console.log(question);
      console.log(answer);
      if (question && answer) {
        if (
          question === answer &&
          question.trim() !== "" &&
          answer.trim() !== ""
        ) {
          ipcRenderer.send("error", "question and answer can't be the same");
        } else {
          global.questions.push(question.trim());
          global.questions.push(answer.trim());
          console.log(global.questions);
        }
      }
    }
  } else {
    document.getElementById("question").value = "";
    document.getElementById("answer").value = "";
  }
}
const el = document.getElementById("btn-question");
if (el) {
  el.addEventListener("click", function () {
    Submit(1);
    Submit(5);
    console.log(global.questions);
    ipcRenderer.send("questions", global.questions);
  });
}
