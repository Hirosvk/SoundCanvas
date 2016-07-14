const Note = require('./note.js');
const Scales = require('../constants/scales.js');
const Transpose = require('../utils/transpose.js');
const KickDrum = require('./drum.js').KickDrum;

const keyMatch = ['KeyA','KeyS','KeyD','KeyF','KeyG','KeyH','KeyJ','KeyK','KeyL'];


function Keyboard(options, track, trackOptions){
  this.notes = Transpose.generateNotes(options.scale, options.root);
  this.keyMatch = keyMatch.slice(0, this.notes.length);
  this.updateNotes = options.updateNotes;
}

Keyboard.prototype.loadTrack = function (track, trackOptions){
  this.track = track;
  this.trackOptions = {
    tempo: trackOptions.tempo,
    timeSig: trackOptions.timeSig
  };
};

Keyboard.prototype.unloadTrack = function () {
  this.track = undefined;
  this.trackOptions = undefined;
};

Keyboard.prototype.showKeys = function () {
  this.notes.forEach(note => {
    console.log(note);
  });
};


Keyboard.prototype.setupKeys = function (keyboardEl) {
  const boardEl = document.createElement('div');
  boardEl.style = 'keyboard';
  this.notes.forEach((note, idx) => {
    let newKey = document.createElement('span');
    newKey.style = "key";
    newKey.innerHTML = `${note.name} : ${this.keyMatch[idx]}`;
    newKey.id = idx
    newKey.addEventListener("mousedown", this.pressKey.bind(this));
    newKey.addEventListener("mouseup", this.releaseKey.bind(this));
    newKey.addEventListener("mouseout", this.releaseKey.bind(this));
    boardEl.appendChild(newKey);
  });

  document.addEventListener("keydown", this.keydown.bind(this));

  document.addEventListener("keyup", this.keyup.bind(this));

  keyboardEl.appendChild(boardEl);
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
  }
};


Keyboard.prototype.managePlayback = function(){
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
  })
  // update indices below
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
};

Keyboard.prototype.playTrack = function(){
  if (this.track){
    let interval = 1000 /
        (this.track.noteLength / this.trackOptions.timeSig) *
        (60/this.trackOptions.tempo);
    this.currentTrack = setInterval(this.managePlayback.bind(this), interval);
  }
};

Keyboard.prototype.stopTrack = function () {
  clearInterval(this.currentTrack);
  this.clearNotes();
};

Keyboard.prototype.clearNotes = function () {
  this.keyMatch.forEach((key, idx) => {
    this.notes[idx].stop();
  })
};


module.exports = Keyboard;
window.Keyboard = Keyboard;
