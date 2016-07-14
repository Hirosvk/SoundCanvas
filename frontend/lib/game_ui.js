const MusicTracker = require('./music_tracker.js');
const Canvas = require('./canvas.js');

function GameUI(){
}

GameUI.prototype.receiveNotes = function (notes) {
  this.canvas.receiveNotes(notes);
};

GameUI.prototype.setupMusicTracker = function (musicEl, musicOptions) {
  this.musicTracker = new MusicTracker (
    musicOptions.keyboard,
    musicOptions.beatMaker,
    this.receiveNotes.bind(this)
  );
  this.musicTracker.setup(musicEl);
};
//
GameUI.prototype.setupCanvas = function (canvasEl, dims) {
  this.ctx = canvasEl.getContext('2d');
  this.canvas = new Canvas(this.ctx, dims);
};

GameUI.prototype.setupCanvasGrid = function (triDim) {
  this.canvas.setupGrid(triDim);
};

GameUI.prototype.showTriangle = function (pos){
  console.log(this.canvas.getTriangle(pos));
};


module.exports = GameUI;
window.GameUI = GameUI;
