const Note = require('./note.js');
const Scales = require('../constants/scales.js');
const Transpose = require('../utils/transpose.js');
const KickDrum = require('./drum.js').KickDrum;

const keyMatch = ['KeyA','KeyS','KeyD','KeyF','KeyG','KeyH','KeyJ','KeyK','KeyL'];


function generateNotes(scale, root){
  let allNotes = [];
  let totalInt = 0;
  for (let i = 0; i < Scales[scale].length; i++){
    totalInt += Scales[scale][i];
    let newNoteName = Transpose.getNote(root, totalInt);
    allNotes.push(new Note(newNoteName));
  }
  return allNotes;
}


function Keyboard(options){
  this.notes = generateNotes(options.scale, options.root);
  this.keyMatch = keyMatch.slice(0, this.notes.length);
  this.updateNotes = options.updateNotes;
}

Keyboard.prototype.showKeys = function () {
  this.notes.forEach(note => {
    console.log(note);
  });
};


Keyboard.prototype.setup = function (el) {
  const boardEl = document.createElement('div');
  boardEl.style = 'keyboard';
  this.notes.forEach((note, idx) => {
    let newKey = document.createElement('span');
    newKey.style = "key";
    newKey.innerHTML = note.name;
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
    this.updateNotes(this.notes[idx].name);
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
