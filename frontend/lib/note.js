const freq = require('../constants/notes.js');
const audioContext = require('../constants/audio_context.js');

function Note (noteName){
  let frequency;
  if (typeof noteName === 'number'){
    frequency = noteName;
  }
  this.noteName = noteName;
  this.osc = audioContext.createOscillator();
  this.osc.frequency.value = frequency || freq[noteName];
  this.gainNode = audioContext.createGain();
  this.gainNode.gain.value = 0;
  this.osc.connect(this.gainNode);
  this.gainNode.connect(audioContext.destination);
  this.osc.start(0);
}

Note.prototype.start = function(){
  // this.osc.connect(audioContext.destination);
  // when connecting/disconnecting to 'destination' to start/stop the note,
  // it made unplesant noise. Controlling gained worked better in terms of
  // sound quality.
  this.gainNode.gain.value = 0.3;
  console.log(this.noteName);
};

Note.prototype.stop = function(){
  // this.osc.disconnect(audioContext.destination);
  this.gainNode.gain.value = 0;
};

Note.prototype.name = function(){
  return this.noteName;
};

Note.prototype.frequency = function () {
  return freq[this.noteName];
};

module.exports = Note;
window.Note = Note;
