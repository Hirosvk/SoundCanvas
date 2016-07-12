const freq = require('../constants/notes.js');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const Note = function(noteName){
  this.noteName = noteName;
  this.osc = audioContext.createOscillator();
  this.osc.frequency.value = freq[noteName];
  this.gainNode = audioContext.createGain();
  this.gainNode.gain.value = 0;
  this.osc.connect(this.gainNode);
  this.gainNode.connect(audioContext.destination);
  this.osc.start(0);
}

Note.prototype.start = function(){
  // this.osc.connect(audioContext.destination);
  this.gainNode.gain.value = 0.3;
}

Note.prototype.stop = function(){
  // this.osc.disconnect(audioContext.destination);
  this.gainNode.gain.value = 0;
}

Note.prototype.name = function(){
  return this.noteName;
}

Note.prototype.frequency = function () {
  return freq[this.noteName];
};

// Note.play = function(noteName){
//   const note = new Note(noteName);
//   return note.start();
// }

module.exports = Note;
