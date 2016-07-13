const KickDrum = require('./drum.js').KickDrum;
const BeatPatterns = require('../constants/beat_patterns.js');

function BeatMaker(tempo, pattern, drum){
  this.tempo = tempo;
  this.pattern = BeatPatterns[pattern];
  this.drum = drum;
}

BeatMaker.prototype.setup = function(parentEl){
  let startButton = document.createElement('button');
  startButton.innerHTML = "start beat";
  startButton.addEventListener("click", function(event){
    event.preventDefault();
    this.start();
  }.bind(this));

  let stopButton = document.createElement('button');
  stopButton.innerHTML = "stop beat";
  stopButton.addEventListener("click", function(event){
    event.preventDefault();
    this.stop();
  }.bind(this));
  parentEl.appendChild(startButton);
  parentEl.appendChild(stopButton);
};

BeatMaker.prototype.manageBeat = function () {
  this.idx = this.idx || 0;
  if (this.pattern[this.idx]){
    this.drum.start();
  }
  this.idx = (this.idx === this.pattern.length - 1) ? 0 : this.idx + 1;
};


BeatMaker.prototype.start = function () {
  let interval = (this.tempo / 60) / (this.pattern.length / 4) * 1000;
  this.currentBeat = setInterval(this.manageBeat.bind(this), interval);
};

BeatMaker.prototype.stop = function () {
  if (this.currentBeat) { clearInterval(this.currentBeat); }
};


module.exports = BeatMaker;
