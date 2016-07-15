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
  let keyboardOptions = {
    updateNotes: this.updateNotes.bind(this),
    scale: options.scale,
    root: options.root
  };
  let beatMakerOptions = {
    emitNotes: this.emitNotes.bind(this),
    clearStore: this.clearStore.bind(this),
    pattern: options.pattern
  };

  this.options = options;

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
};

MusicTracker.prototype.setListenStatus = function (boolean) {
  this.beatOn = boolean;
};

MusicTracker.prototype.updateNotes = function (note) {
  if (this.beatOn){
    if (this.trackerStore.length > 6 ){this.trackerStore.splice(0,1);}
    this.trackerStore.push(note);
  }
};


// MusicTracker.prototype.unloadTrack = function () {
//   this.track = undefined;
//   this.keyboard.unloadTrack();
// };

// MusicTracker.prototype.start = function () {
//   this.beatMaker.start();
//   this.keyboard.playTrack();
// };

MusicTracker.prototype.start = function(){
  const interval = 1000 /
      (8 / this.options.timeSig) *
      (60/this.options.tempo);
      // tracks and beat patterns are written in 1/8 notes.
  this.setListenStatus(true);
  this.demoPlayback = setInterval(function(){
    this.keyboard.managePlayback.call(this.keyboard);
    this.beatMaker.manageBeat.call(this.beatMaker);
  }.bind(this), interval);
};

MusicTracker.prototype.stop = function(){
  this.keyboard.stop.call(this.keyboard);
  clearInterval(this.demoPlayback);
  this.setListenStatus(false);
};

// MusicTracker.prototype.resetKeyboard = function () {
//   this.keyboard.removeListeners();
// };

module.exports = MusicTracker;
