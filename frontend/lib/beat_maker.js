const KickDrum = require('./drum.js').KickDrum;
const BeatPatterns = require('../constants/beat_patterns.js');

function BeatMaker(options){
  this.tempo = options.tempo;
  this.pattern = BeatPatterns[options.pattern];
  this.timeSig = options.timeSig || 4;

  this.emitNotes = options.emitNotes;
  this.clearStore = options.clearStore;
  this.setListenStatus = options.setListenStatus;
  this.drum = new KickDrum;
}

BeatMaker.prototype.setup = function(parentEl){
  let startButton = document.createElement('button');

  startButton.innerHTML = "start beat";
  startButton.addEventListener("click", function(event){
    event.preventDefault();
    this.start();
  }.bind(this));
  parentEl.appendChild(startButton);

  let stopButton = document.createElement('button');
  stopButton.innerHTML = "stop beat";
  stopButton.addEventListener("click", function(event){
    event.preventDefault();
    this.stop();
  }.bind(this));
  parentEl.appendChild(stopButton);
};

BeatMaker.prototype.manageBeat = function () {
  this.idx = this.idx || 0;
  if (this.pattern[this.idx]){
    this.drum.start();
    this.emitNotes();
  }
  if (this.idx === this.pattern.length -1){
    this.idx = 0;
    this.clearStore();
  } else {
    this.idx++;
  }
  // this.idx = (this.idx === this.pattern.length - 1) ? 0 : this.idx + 1;
};


BeatMaker.prototype.start = function () {
  this.setListenStatus(true);
  let interval = (this.tempo / 60) / (this.pattern.length / this.timeSig) * 1000;
  this.currentBeat = setInterval(this.manageBeat.bind(this), interval);
};

BeatMaker.prototype.stop = function () {
  this.setListenStatus(false);
  if (this.currentBeat) { clearInterval(this.currentBeat); }
};


module.exports = BeatMaker;
