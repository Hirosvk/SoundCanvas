const MusicTracker = require('./music_tracker.js');
const Canvas = require('./canvas.js');
const Tracks = require('../constants/tracks.js');

function GameUI(){
}

GameUI.prototype.receiveNotes = function (notes) {
  this.canvas.receiveNotes(notes);
};

GameUI.prototype.setupMusicTracker = function (keyboardEl, musicOptions) {
  this.musicTracker = new MusicTracker (
    musicOptions.keyboard,
    musicOptions.beatMaker,
    this.receiveNotes.bind(this)
  );
  this.musicTracker.setupKeys(keyboardEl);
};
//
GameUI.prototype.setupCanvas = function (canvasEl, dims) {
  this.ctx = canvasEl.getContext('2d');
  this.canvas = new Canvas(this.ctx, dims);
  this.canvas.setupGrid(30);
};


GameUI.prototype.setupButtons = function (dashboardEl) {
  let startButton = document.createElement('button');

  startButton.innerHTML = "start";
  startButton.addEventListener("click", function(event){
    event.preventDefault();
    this.start();
  }.bind(this));
  dashboardEl.appendChild(startButton);

  let stopButton = document.createElement('button');
  stopButton.innerHTML = "stop";
  stopButton.addEventListener("click", function(event){
    event.preventDefault();
    this.stop();
  }.bind(this));
  dashboardEl.appendChild(stopButton);
};


GameUI.prototype.start = function() {
  this.canvas.animate();
  this.musicTracker.start();
};

GameUI.prototype.stop = function () {
  this.canvas.stopAnimation();
  this.musicTracker.stop();
};

GameUI.prototype.loadTrack = function (track){
  this.musicTracker.loadTrack(track);
};

GameUI.prototype.unloadTrack = function () {
  this.musicTracker.unloadTrack();
};

GameUI.prototype.clearCanvas = function () {
  this.canvas.clearCanvas();
};

module.exports = GameUI;
window.GameUI = GameUI;
