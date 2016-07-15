const Note = require('./note.js');
const Scales = require('../constants/scales.js');
const Transpose = require('../utils/transpose.js');
const KickDrum = require('./drum.js').KickDrum;

const keyMatch = ['KeyA','KeyS','KeyD','KeyF','KeyG','KeyH','KeyJ','KeyK','KeyN', 'KeyM',
                  'Comma', 'Period', 'Slash'];

let _keydown, _keyup;

function Keyboard(keyboardEl, options, track){
  this.keyboardEl = keyboardEl;
  this.notes = Transpose.generateNotes(options.scale, options.root);
  this.keyMatch = keyMatch.slice(0, this.notes.length);
  this.updateNotes = options.updateNotes;
  this.track = track;
  this.setupKeys();
}

Keyboard.prototype.setupKeys = function () {
  let _boardEl = document.getElementById('keyboard');
  if (_boardEl){
    this.keyboardEl.removeChild(_boardEl);
  }

  const boardEl = document.createElement('ul');
  boardEl.setAttribute("class", 'keyboard');
  boardEl.setAttribute("id", 'keyboard');

  this.notes.forEach((note, idx) => {
    let newKey = document.createElement('li');
    newKey.setAttribute("class", "key");
    newKey.innerHTML = `${note.name}<br/>${this.keyMatch[idx]}`;
    newKey.id = idx;
    newKey.addEventListener("mousedown", this.pressKey.bind(this));
    newKey.addEventListener("mouseup", this.releaseKey.bind(this));
    newKey.addEventListener("mouseout", this.releaseKey.bind(this));
    boardEl.appendChild(newKey);
  });
  if (!this.track){
    _keydown = this.keydown.bind(this);
    _keyup = this.keyup.bind(this);
    document.addEventListener("keydown", _keydown);
    document.addEventListener("keyup", _keyup);
  }
  this.keyboardEl.appendChild(boardEl);
};

Keyboard.prototype.pressKey = function (event){
  this.keydown(parseInt(event.target.id));
};

Keyboard.prototype.releaseKey = function (event) {
  this.keyup(parseInt(event.target.id));
};

Keyboard.prototype.keydown = function(event) {
  let idx;
  if (typeof event === 'number') {
    idx = event;
  } else {
    event.preventDefault();
    idx = this.keyMatch.indexOf(event.code);
  }
  if (idx > -1) {
    if (this.notes[idx].start()){
      this.updateNotes(this.notes[idx].name);
    }
    document.getElementById(idx).setAttribute("class", "key active");
  }
};

Keyboard.prototype.keyup = function(event){
  let idx;
  if (typeof event === 'number') {
    idx = event;
  } else {
    event.preventDefault();
    idx = this.keyMatch.indexOf(event.code);
  }
  if (idx > -1) {
    this.notes[idx].stop();
    document.getElementById(idx).setAttribute("class", "key");
  }
};


Keyboard.prototype.managePlayback = function(){
  if (this.track){
    this.barIdx = this.barIdx || 0;
    this.noteIdx = this.noteIdx || 0;
    this.keyMatch.forEach( (key, idx) => {
      if (this.track[idx]){
        let note = this.track[idx][this.barIdx][this.noteIdx];
        if (note) {
          this.keydown(idx);
        } else {
          this.keyup(idx);
        }
      }
    });
    if (this.noteIdx === this.track.noteLength - 1){
      this.noteIdx = 0;
      if (this.barIdx === this.track.barLength - 1){
        this.barIdx = 0;
      } else {
        this.barIdx++;
      }
    } else {
      this.noteIdx++;
    }
  }
};

Keyboard.prototype.stop = function () {
  this.clearNotes();
  this.removeListeners();
  this.track = undefined;
};

Keyboard.prototype.clearNotes = function () {
  this.keyMatch.forEach((key, idx) => {
    this.notes[idx].stop();
  });
};

Keyboard.prototype.removeListeners = function () {
  document.removeEventListener("keydown", _keydown);
  document.removeEventListener("keyup", _keyup);
};


module.exports = Keyboard;
window.Keyboard = Keyboard;
