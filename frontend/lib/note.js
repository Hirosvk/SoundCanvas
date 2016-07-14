const freq = require('../constants/notes.js');
const audioContext = require('../constants/audio_context.js');

function Note (name){
  this.name = name;
  this.osc = audioContext.createOscillator();
  this.osc.frequency.value = freq[name];
  this.gainNode = audioContext.createGain();
  this.gainNode.gain.value = 0;
  this.osc.connect(this.gainNode);
  this.gainNode.connect(audioContext.destination);
  this.osc.start(0);

  this.playing = false;
}

Note.prototype.start = function(){
  // this.osc.connect(audioContext.destination);
  // when connecting/disconnecting to 'destination' to start/stop the note,
  // it made unplesant noise. Controlling gained worked better in terms of
  // sound quality.
  if (!this.playing){
    this.gainNode.gain.value = 0.3;
    this.playing = true;
    return true;
  }
  return false;
};

Note.prototype.stop = function(){
  // this.osc.disconnect(audioContext.destination);
  this.gainNode.gain.value = 0;
  this.playing = false;
};

Note.prototype.frequency = function () {
  return freq[this.name];
};

module.exports = Note;
window.Note = Note;
