const electron = require("electron");
const { unlink } = require("original-fs");
const { ipcRenderer } = electron;

const questionText_ = document.getElementById("questions-text");
const answerText_ = document.getElementById("answer-text");
const showAnswerButton_ = document.getElementById("showAnswer-btn");

ipcRenderer.send("send-the-questions");
global.questions;
ipcRenderer.on("questions-sent", (e, questions) => {
  global.questions = questions;
  if (global.questions.length % 2 == 1) {
    global.questions.pop();
  }
});

global.indexOfQuestions = 0;
global.indexOfAnswers = 1;
global.correctCount = 0;
global.incorrectCount = 0;

if (document.getElementById("questions-text")) {
  document.getElementById("questions-text").innerHTML =
    global.questions[indexOfQuestions];
}

function updateAnswer() {
  if (document.getElementById("answer-text")) {
    document.getElementById("answer-text").innerHTML = "";
  }
}

function updateQuestionIncorrect() {
  indexOfQuestions += 2;
  indexOfAnswers += 2;
  if (questionText_.innerHTML !== "undefined") {
    if (document.getElementById("questions-text")) {
      document.getElementById("questions-text").innerHTML =
        global.questions[indexOfQuestions];
    }
    if (document.getElementById("questions-text").innerHTML != "undefined") {
      updateAnswer();
      incorrectCount++;
      console.log(incorrectCount);
      console.log(document.getElementById("questions-text").innerHTML);
      document.getElementById("answer-status-container").style.display = "none";
      document.getElementById("showAnswer-btn").disabled = false;

      console.log(document.getElementById("questions-text").innerHTML);
    } else {
      ipcRenderer.send("error", "No more questions left");
      document.getElementById("questions-text").innerHTML =
        "press Ctrl + R to restart quiz";
      document.getElementById("showAnswer-btn").style.display = "none";
      document.getElementById("answer-text").style.display = "none";
      document.getElementById("answer-status-container").style.display = "none";
      incorrectCount++;
      console.log(incorrectCount);
    }
  }
}

function updateQuestionCorrect() {
  indexOfQuestions += 2;
  indexOfAnswers += 2;
  if (questionText_.innerHTML !== "undefined") {
    if (document.getElementById("questions-text")) {
      document.getElementById("questions-text").innerHTML =
        global.questions[indexOfQuestions];
    }
    if (document.getElementById("questions-text").innerHTML != "undefined") {
      updateAnswer();
      correctCount++;
      console.log(correctCount);
      console.log(document.getElementById("questions-text").innerHTML);
      document.getElementById("answer-status-container").style.display = "none";
      document.getElementById("showAnswer-btn").disabled = false;

      console.log(document.getElementById("questions-text").innerHTML);
    } else {
      correctCount++;
      ipcRenderer.send("error", "No more questions left");
      document.getElementById("questions-text").innerHTML =
        "Press Ctrl + R to restart the quiz or close this window if your done";
      document.getElementById("showAnswer-btn").style.display = "none";
      document.getElementById("answer-text").style.display = "none";
      document.getElementById("answer-status-container").style.display = "none";
      console.log(correctCount);
    }
  }
}

function showAnswerButton(index) {
  document.getElementById("answer-status-container").style.display = "block";
  document.getElementById("showAnswer-btn").disabled = true;
  if (document.getElementById("answer-text")) {
    document.getElementById("answer-text").innerHTML = global.questions[index];
  }
}

if (document.getElementById("showAnswer-btn")) {
  document
    .getElementById("showAnswer-btn")
    .addEventListener("click", function () {
      showAnswerButton(indexOfAnswers);
    });
}

function correctButton() {
  if (document.getElementById("correct-btn")) {
    document
      .getElementById("correct-btn")
      .addEventListener("click", function () {
        updateQuestionCorrect();
      });
  }
}

function incorrectButton() {
  if (document.getElementById("incorrect-btn")) {
    document
      .getElementById("incorrect-btn")
      .addEventListener("click", function () {
        updateQuestionIncorrect();
      });
  }
}

correctButton();
incorrectButton();
