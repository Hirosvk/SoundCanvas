const DrumSounds = require('../constants/drum_sounds.js');
const audioContext = require('../constants/audio_context.js');

function KickDrum (){

}

KickDrum.prototype.name = function(){
  return "Kick Drum";
};

KickDrum.prototype.start = function() {
  this.osc = audioContext.createOscillator();
  this.gainNode = audioContext.createGain();
  this.osc.connect(this.gainNode);
  this.gainNode.connect(audioContext.destination);

  const now = audioContext.currentTime;

  this.osc.frequency.setValueAtTime(150, now);
	this.gainNode.gain.setValueAtTime(2, now);

	this.osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
	this.gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
	this.osc.start(now);

	this.osc.stop(now + 0.5);
};

KickDrum.prototype.stop = function () {
  // does nothing
};

module.exports = {
  KickDrum: KickDrum
};
