const MusicTracker = require('./music_tracker.js');
const Canvas = require('./canvas.js');
const Tracks = require('../constants/tracks.js');

function GameUI(){
  this.active = false;
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


GameUI.prototype.setupSelects = function () {

};

GameUI.prototype.selectMaker = function () {

};

GameUI.prototype.updateTempo = function () {

};
GameUI.prototype.updateBeat = function () {

};

GameUI.prototype.demoSelector = function () {

};

GameUI.prototype.setupButtons = function (dashboardEl) {
  dashboardEl.appendChild(this.buttonMaker("start-button", "Start", this.start));
  dashboardEl.appendChild(this.buttonMaker("stop-button", "Stop", this.stop));
  dashboardEl.appendChild(this.buttonMaker("clear-canvas-button", "Clear Canvas", this.clearCanvas));
};

GameUI.prototype.buttonMaker = function(id, text, callback) {
  let button = document.createElement('button')
  button.innerHTML = text;
  button.setAttribute("id", id);
  button.addEventListener("click", function(event){
    event.preventDefault();
    callback.call(this);
  }.bind(this));
  return button;
};

GameUI.prototype.start = function() {
  this.canvas.animate();
  this.musicTracker.start();
  document.getElementById("start-button").setAttribute("disabled", 'true');
};

GameUI.prototype.stop = function () {
  this.canvas.stopAnimation();
  this.musicTracker.stop();
  document.getElementById("start-button").removeAttribute("disabled");
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
