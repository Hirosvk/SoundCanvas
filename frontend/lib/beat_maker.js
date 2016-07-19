const KickDrum = require('./drum.js').KickDrum;
const BeatPatterns = require('../constants/beat_patterns.js');

function BeatMaker(options){
  this.pattern = BeatPatterns[options.pattern];
  this.emitNotes = options.emitNotes;
  this.clearStore = options.clearStore;
  this.drum = new KickDrum;
}

BeatMaker.prototype.manageBeat = function () {
  this.barIdx = this.barIdx || 0;
  this.beatIdx = this.beatIdx || 0;
  if (this.pattern[this.barIdx][this.beatIdx]){
    this.drum.start();
    this.emitNotes();
  }
  if (this.beatIdx === this.pattern[0].length - 1){
    this.beatIdx = 0;
    this.clearStore();
    if (this.barIdx === this.pattern.length - 1){
      this.barIdx = 0;
    } else {
      this.barIdx++;
    }
  } else {
    this.beatIdx++;
  }
};


module.exports = BeatMaker;
