const Note = require('./note.js');
const Scales = require('../constants/scales.js');
const Transpose = require('../utils/transpose.js');

const keyMatch = ['KeyA','KeyS','KeyD','KeyF','KeyF','KeyH','KeyJ','KeyK','KeyL'];


function generateNotes(scale, rootNote){
  let allNotes = [];
  let totalInt = 0;
  for (let i = 0; i < Scales[scale].length; i++){
    totalInt += Scales[scale][i];
    let newNoteName = Transpose.getNote(rootNote, totalInt);
    allNotes.push(new Note(newNoteName));
  }
  return allNotes;
}


function Keyboard(scale, rootNote, octav){
  this.notes = generateNotes(scale, rootNote);
  this.keyMatch = keyMatch.slice(0, this.notes.length);
}

Keyboard.prototype.showKeys = function () {
  this.notes.forEach(note => {
    console.log(note);
  });
};

Keyboard.prototype.render = function (el) {
  const boardEl = document.createElement('div');
  boardEl.style = 'keyboard';
  this.notes.forEach((note, idx) => {
    let newKey = document.createElement('span');
    newKey.style = "key";
    newKey.innerHTML = note.name();
    boardEl.appendChild(newKey);
  });

  document.addEventListener("keydown", this.keydown.bind(this));

  document.addEventListener("keyup", this.keyup.bind(this));

  el.appendChild(boardEl);
};


Keyboard.prototype.keydown = function(event) {
  event.preventDefault();
  let idx = this.keyMatch.indexOf(event.code);
  if (idx > -1) {
    this.notes[idx].start();
  }
};

Keyboard.prototype.keyup = function(event){
  event.preventDefault();
  let idx = this.keyMatch.indexOf(event.code);
  if (idx > -1) {
    this.notes[idx].stop();
  }
};



module.exports = Keyboard;
window.Keyboard = Keyboard;
