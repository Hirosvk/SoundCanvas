const Keyboard = require('./keyboard.js');
const BeatMaker = require('./beat_maker.js');

function MusicTracker (keyboardOptions, beatMakerOptions, passNotesToUI){
  this.passNotesToUI = passNotesToUI;

  this.trackerStore = [];
  keyboardOptions.updateNotes = this.updateNotes.bind(this);
  this.keyboard = new Keyboard (keyboardOptions, this.trackerStore);

  this.beatOn = false;
  beatMakerOptions.setListenStatus = this.setListenStatus.bind(this);
  beatMakerOptions.emitNotes = this.emitNotes.bind(this);
  beatMakerOptions.clearStore = this.clearStore.bind(this);
  this.beatMaker = new BeatMaker(beatMakerOptions);
}

MusicTracker.prototype.setup = function (musicEl) {
  const keyboardEl = document.createElement('div');
  keyboardEl.style = 'keyboard-frame';
  this.keyboard.setup(keyboardEl);
  const beatMakerEl = document.createElement('div');
  beatMakerEl.style = 'beat-maker-frame';
  this.beatMaker.setup(beatMakerEl);

  musicEl.appendChild(keyboardEl);
  musicEl.appendChild(beatMakerEl);
};

MusicTracker.prototype.emitNotes = function(){
  this.passNotesToUI(this.trackerStore);
};

MusicTracker.prototype.clearStore = function(){
  this.trackerStore = [];
}

MusicTracker.prototype.setListenStatus = function (boolean) {
  this.beatOn = boolean;
};

MusicTracker.prototype.updateNotes = function (note) {
  if (this.beatOn){
    if (this.trackerStore.length > 6 ){this.trackerStore.splice(0,1);}
    this.trackerStore.push(note);
  }
};

module.exports = MusicTracker;
