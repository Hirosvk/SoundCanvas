const Keyboard = require('./keyboard.js');
const BeatMaker = require('./beat_maker.js');

function MusicTracker (options, passNotesToUI, keyboardEl){
  this.passNotesToUI = passNotesToUI;
  this.keyboardEl = keyboardEl;

  this.trackerStore = [];
  this.beatOn = false;
  this.reset(options);
}

MusicTracker.prototype.reset = function(options, track){
  keyboardOptions = {
    updateNotes: this.updateNotes.bind(this),
    scale: options.scale,
    root: options.root,
    tempo: options.tempo
  }
  beatMakerOptions = {
    setListenStatus: this.setListenStatus.bind(this),
    emitNotes: this.emitNotes.bind(this),
    clearStore: this.clearStore.bind(this),
    tempo: options.tempo,
    timeSig: options.timeSig,
    pattern: options.pattern
  }

  this.keyboard = new Keyboard (
    this.keyboardEl,
    keyboardOptions,
    track
  );

  this.beatMaker = new BeatMaker(beatMakerOptions);
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

// MusicTracker.prototype.loadTrack = function (track) {
//   this.track = track;
//   this.keyboard.loadTrack(track, this.trackOptions);
// };
//
// MusicTracker.prototype.unloadTrack = function () {
//   this.track = undefined;
//   this.trackOptions = undefined;
//   this.keyboard.unloadTrack();
// };

MusicTracker.prototype.start = function () {
  this.keyboard.playTrack();
  this.beatMaker.start();
};

MusicTracker.prototype.stop = function(){
  this.keyboard.stopTrack();
  this.beatMaker.stop();
}

MusicTracker.prototype.resetKeyboard = function () {
  this.keyboard.removeListeners();
};

module.exports = MusicTracker;
