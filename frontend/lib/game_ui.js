const MusicTracker = require('./music_tracker.js');
const Canvas = require('./canvas.js');
const Tracks = require('../constants/tracks.js');

function GameUI(){
  this.resetPending = false;
}

const DefaultMusicOptions = {
  scale: "major",
  root: "C4",
  tempo: 120,
  pattern: "FourBeat",
  timeSig: 4
};

GameUI.prototype.receiveNotes = function (notes) {
  console.log(notes);
  this.canvas.receiveNotes(notes);
};

GameUI.prototype.setupMusicTracker = function (keyboardEl) {
  this.musicTracker = new MusicTracker (
    DefaultMusicOptions,
    this.receiveNotes.bind(this),
    keyboardEl
  );
  this.musicOptions = DefaultMusicOptions;
};
//
GameUI.prototype.setupCanvas = function (canvasEl, dims) {
  this.ctx = canvasEl.getContext('2d');
  this.canvas = new Canvas(this.ctx, dims);
  this.canvas.setupGrid(30);
};


GameUI.prototype.setupSelects = function (optionEl) {
  scaleOptions = ["major",'minor']
  optionEl.appendChild(this.selectMaker("scale", scaleOptions));
  tempoOptions = [140,120, 100, 80, 60, 40];
  optionEl.appendChild(this.selectMaker("tempo", tempoOptions));
  patternOptions = ['FourBeat', 'FourBeat2'];
  optionEl.appendChild(this.selectMaker("pattern", patternOptions));
};

GameUI.prototype.selectMaker = function (id, options) {
  let select = document.createElement('select');
  select.setAttribute("class", "selector");
  select.setAttribute("id", id);
  select.addEventListener('change', function(){
    this.resetPending = true;
  }.bind(this));

  options.forEach(option => {
    let newOption = document.createElement('option');
    newOption.setAttribute("value", option);
    if (this.musicOptions[id] === option){
      newOption.setAttribute("selected", "true")
    }
    newOption.innerHTML = option;
    select.appendChild(newOption);
  })

  let label = document.createElement('label');
  label.innerHTML = id;
  label.appendChild(select)
  return label;
};

GameUI.prototype.updateMusicOptions = function () {
  let selectors = document.getElementsByClassName('selector')
  for (let i = 0; i < selectors.length; i++){
    this.musicOptions[selectors[i].id] = selectors[i].value;
  }
  return this.musicOptions;
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
  document.getElementById("start-button").setAttribute("disabled", 'true');
  if (this.resetPending){
    this.updateMusicOptions();
    this.musicTracker.resetKeyboard();
    this.musicTracker.reset(this.musicOptions);
  }
  this.canvas.animate();
  this.musicTracker.start();
};

GameUI.prototype.stop = function () {
  this.canvas.stopAnimation();
  this.musicTracker.stop();
  document.getElementById("start-button").removeAttribute("disabled");
  this.resetPending = false;
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
