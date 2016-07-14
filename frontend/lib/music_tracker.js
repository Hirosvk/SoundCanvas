const Keyboard = require('./keyboard.js');
const BeatMaker = require('./beat_maker.js');

function MusicTracker (keyboardOptions, beatMakerOptions, passNotesToUI){
  this.passNotesToUI = passNotesToUI;

  this.trackerStore = [];
  this.beatOn = false;
  this.reset(keyboardOptions, beatMakerOptions)
}

MusicTracker.prototype.reset = function(keyboardOptions, beatMakerOptions){
  keyboardOptions.updateNotes = this.updateNotes.bind(this);
  this.keyboard = new Keyboard (keyboardOptions, this.trackerStore);

  beatMakerOptions.setListenStatus = this.setListenStatus.bind(this);
  beatMakerOptions.emitNotes = this.emitNotes.bind(this);
  beatMakerOptions.clearStore = this.clearStore.bind(this);
  this.beatMaker = new BeatMaker(beatMakerOptions);

  this.trackOptions = {
    tempo: beatMakerOptions.tempo,
    timeSig: beatMakerOptions.timeSig
  }
  if (this.track){
    this.loadTrack(this.track, this.trackOptions);
  }

};

MusicTracker.prototype.setupKeys = function (keyboardEl) {
  this.keyboard.setupKeys(keyboardEl);
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

MusicTracker.prototype.loadTrack = function (track) {
  this.track = track;
  this.keyboard.loadTrack(track, this.trackOptions);
};

MusicTracker.prototype.unloadTrack = function () {
  this.track = undefined;
  this.trackOptions = undefined;
  this.keyboard.unloadTrack();
};

MusicTracker.prototype.start = function () {
  this.keyboard.playTrack();
  this.beatMaker.start();
};

MusicTracker.prototype.stop = function(){
  this.beatMaker.stop();
  this.keyboard.stopTrack();
}

module.exports = MusicTracker;
