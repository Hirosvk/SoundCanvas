const MusicTracker = require('./music_tracker.js');
const Canvas = require('./canvas.js');
const Tracks = require('../constants/tracks.js');
const Scales = require('../constants/scales.js');

const ScaleOptions = Object.getOwnPropertyNames(Scales);
const TrackOptions = Object.getOwnPropertyNames(Tracks);

function GameUI(){
  this.resetPending = false;
}

const DefaultMusicOptions = {
  scale: "Major",
  root: "C4",
  tempo: 120,
  pattern: "FourBeat",
  timeSig: 4,
  track: "BlueButterfly"
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

GameUI.prototype.setupDemoSelector = function (demoEl) {
  let demoOptions = TrackOptions;
  demoEl.appendChild(this.selectMaker("track", "Choose a Demo Track", demoOptions));
  demoEl.appendChild(this.buttonMaker("demo-start", "Watch Demo", this.playDemo));
};

GameUI.prototype.setupButtons = function (dashboardEl) {
  dashboardEl.appendChild(this.buttonMaker("start-button", "Activate Canvas", this.start));
  dashboardEl.appendChild(this.buttonMaker("stop-button", "Stop", this.stop));
  dashboardEl.appendChild(this.buttonMaker("clear-canvas-button", "Clear Canvas", this.clearCanvas));
};

GameUI.prototype.setupSelects = function (optionEl) {
  let scaleOptions = ScaleOptions;
  optionEl.appendChild(this.selectMaker("scale", "Scale", scaleOptions));
  let tempoOptions = [180,160, 140, 120, 100, 80, 60, 40];
  optionEl.appendChild(this.selectMaker("tempo", "Tempo", tempoOptions));
  let patternOptions = ['FourBeat', 'DownBeat', 'FunBeat'];
  optionEl.appendChild(this.selectMaker("pattern", "Beat Pattern", patternOptions));
};


GameUI.prototype.start = function() {
  this.musicTracker.stop();

  document.getElementById("start-button").setAttribute("disabled", 'true');
  document.getElementById("demo-start").setAttribute("disabled", 'true');

  this.updateMusicOptions();
  this.musicTracker.reset(this.musicOptions, this.track);

  let selectors = document.getElementsByTagName('select');
  for (let i = 0; i < selectors.length; i++){
    selectors[i].setAttribute("disabled", true);
  }

  this.canvas.animate();
  this.musicTracker.start();
};

GameUI.prototype.stop = function () {
  this.canvas.stopAnimation();
  this.musicTracker.stop();
  document.getElementById("start-button").removeAttribute("disabled");
  document.getElementById("demo-start").removeAttribute("disabled");
  let selectors = document.getElementsByTagName('select');
  for (let i = 0; i < selectors.length; i++){
    selectors[i].removeAttribute("disabled");
  }
  this.resetPending = false;
  this.track = undefined;
};

GameUI.prototype.playDemo = function() {
  let trackEl = document.getElementById('track');
  let track = Tracks[trackEl.value];
  document.getElementById('scale').value = track.scale;
  document.getElementById('pattern').value = track.pattern;
  document.getElementById('tempo').value = track.tempo;
  this.musicOptions.timeSig = track.timeSig;
  this.resetPending = true;
  this.track = track;
  this.canvas.clearCanvas();

  this.start();
};


GameUI.prototype.selectMaker = function (id, labelText, options) {
  let select = document.createElement('select');
  select.setAttribute("class", "selector");
  select.setAttribute("id", id);
  // select.addEventListener('change', function(){
  //   this.resetPending = true;
  // }.bind(this));
  options.forEach(option => {
    let newOption = document.createElement('option');
    newOption.setAttribute("value", option);
    if (this.musicOptions[id] === option){
      newOption.setAttribute("selected", "true");
    }
    newOption.innerHTML = option;
    select.appendChild(newOption);
  });

  let label = document.createElement('label');
  label.innerHTML = labelText;
  label.appendChild(select);
  return label;
};

GameUI.prototype.updateMusicOptions = function () {
  let selectors = document.getElementsByClassName('selector');
  for (let i = 0; i < selectors.length; i++){
    this.musicOptions[selectors[i].id] = selectors[i].value;
  }
  return this.musicOptions;
};

GameUI.prototype.buttonMaker = function(id, text, callback) {
  let button = document.createElement('button');
  button.innerHTML = text;
  button.setAttribute("id", id);
  button.addEventListener("click", function(event){
    event.preventDefault();
    callback.call(this);
  }.bind(this));
  return button;
};


GameUI.prototype.clearCanvas = function () {
  this.canvas.clearCanvas();
};

GameUI.prototype.receiveNotes = function (notes) {
  this.canvas.receiveNotes(notes);
};


module.exports = GameUI;
