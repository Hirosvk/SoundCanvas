/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Canvas = __webpack_require__(1);
	const MusicTracker = __webpack_require__(5);
	const GameUI = __webpack_require__(15);
	
	document.addEventListener("DOMContentLoaded", function(){
	  const gameUI = new GameUI();
	
	  const canvasEl = document.getElementById('canvas');
	  gameUI.setupCanvas(canvasEl, [canvasEl.width, canvasEl.height]);
	
	  const musicFrame = document.getElementById('music-tracker');
	  musicOptions = {
	    keyboard:  {
	      scale: "major",
	      root: "C4"
	    },
	    beatMaker: {
	      tempo: 60,
	      pattern: "FourBeat"
	    }
	  }
	  gameUI.setupMusicTracker(musicFrame, musicOptions);
	
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Circle = __webpack_require__(2);
	const Colors = __webpack_require__(3);
	const Transpose = __webpack_require__(4);
	// const options = {
	//   pos: [100, 100],
	//   vel: [1,1],
	//   rad: 10,
	//   color: 'red'
	// }
	
	function Canvas(dims){
	  this.dims = dims;
	  this.elements = [];
	}
	
	Canvas.prototype.receiveNotes = function (notes) {
	  console.log(this.generateColors(notes));
	};
	
	Canvas.prototype.generateColors = function (notes) {
	  let intervals = [];
	  for(let i = 0; i < notes.length -1; i++){
	    for(let j = i+1; j < notes.length; j++){
	      intervals.push(Transpose.interval(notes[i], notes[j]));
	    }
	  }
	  return intervals.map(int => Colors[int]);
	};
	
	Canvas.prototype.addCircle = function (options) {
	  this.elements.push(new Circle (options));
	};
	
	
	Canvas.prototype.render = function (ctx) {
	  ctx.clearRect(0, 0, this.dims[0], this.dims[1]);
	  this.elements.forEach( circle => {
	    circle.move();
	    circle.draw(ctx);
	  })
	};
	
	Canvas.prototype.animate = function(ctx){
	  setInterval(this.render.bind(this, ctx), 10);
	}
	
	module.exports = Canvas;


/***/ },
/* 2 */
/***/ function(module, exports) {

	function Circle (options){
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.rad = options.rad;
	  this.color = options.color;
	}
	
	Circle.prototype.move = function(){
	  this.pos[0] = this.pos[0] + this.vel[0];
	  this.pos[1] = this.pos[1] + this.vel[1];
	}
	
	Circle.prototype.draw = function(ctx){
	  ctx.beginPath();
	  ctx.arc(this.pos[0], this.pos[1], this.rad, 0, Math.PI * 2);
	  ctx.fillStyle = this.color;
	  ctx.fill();
	}
	
	
	
	
	module.exports = Circle;


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = {
	  0: '#000000',
	  3: '#00FFFF',
	  4: '#FFFF00',
	  5: '#0000FF',
	  7: '#FF0000',
	  8: '#FF00FF',
	  9: '#00FF00'
	}
	
	// 0 	#ff0000 red
	// 60 	#ffff00 yellow
	// 120 #00ff00 green
	// 180 #00ffff light blue
	// 240 #0000FF blue
	// 300 #ff00ff pink/purple


/***/ },
/* 4 */
/***/ function(module, exports) {

	const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
	module.exports = {
	  interval(noteA, noteB){
	    const _noteA = noteA.match(/([A-Gb]+)(\d)/);
	    const _noteB = noteB.match(/([A-Gb]+)(\d)/);
	    let hNote, hNum, lNote, lNum;
	
	    if(
	      ( notes.indexOf(_noteB[1]) > notes.indexOf(_noteA[1]) && _noteB[2] === _noteA[2] ) ||
	      (_noteB[2] > _noteA[2])){
	      lNote = _noteA[1]; lNum = _noteA[2];
	      hNote = _noteB[1]; hNum = _noteB[2];
	    } else {
	      hNote = _noteA[1]; hNum = _noteA[2];
	      lNote = _noteB[1]; lNum = _noteB[2];
	    }
	
	    return notes.indexOf(hNote) - notes.indexOf(lNote) + ((hNum - lNum) * 12);
	  },
	
	  getNote(root, interval){
	    const _root = root.match(/([A-Gb]+)(\d)/);
	    const rNote = _root[1];
	    const rNum = _root[2];
	
	    const rIdx = notes.indexOf(rNote);
	    return notes[(rIdx + interval)%12] + (parseInt(rNum) + Math.floor((rIdx + interval)/12)).toString();
	
	  }
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Keyboard = __webpack_require__(6);
	const BeatMaker = __webpack_require__(13);
	
	function MusicTracker (keyboardOptions, beatMakerOptions, passNotesToUI){
	  this.passNotesToUI = passNotesToUI;
	
	  this.trackerStore = [];
	  keyboardOptions.updateNotes = this.updateNotes.bind(this);
	  this.keyboard = new Keyboard (keyboardOptions, this.trackerStore);
	
	  this.beatOn = false;
	  beatMakerOptions.setListenStatus = this.setListenStatus.bind(this);
	  beatMakerOptions.emitNotes = this.emitNotes.bind(this);
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
	  console.log(this.trackerStore);
	  this.passNotesToUI(this.trackerStore);
	  this.clearStore();
	};
	
	MusicTracker.prototype.clearStore = function(){
	  this.trackerStore = [];
	}
	
	MusicTracker.prototype.setListenStatus = function (boolean) {
	  this.beatOn = boolean;
	};
	
	MusicTracker.prototype.updateNotes = function (note) {
	  if (this.beatOn){
	    this.trackerStore.push(note);
	  }
	};
	
	module.exports = MusicTracker;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Note = __webpack_require__(7);
	const Scales = __webpack_require__(10);
	const Transpose = __webpack_require__(4);
	const KickDrum = __webpack_require__(11).KickDrum;
	
	const keyMatch = ['KeyA','KeyS','KeyD','KeyF','KeyG','KeyH','KeyJ','KeyK','KeyL'];
	
	
	function generateNotes(scale, root){
	  let allNotes = [];
	  let totalInt = 0;
	  for (let i = 0; i < Scales[scale].length; i++){
	    totalInt += Scales[scale][i];
	    let newNoteName = Transpose.getNote(root, totalInt);
	    allNotes.push(new Note(newNoteName));
	  }
	  return allNotes;
	}
	
	
	function Keyboard(options){
	  this.notes = generateNotes(options.scale, options.root);
	  this.keyMatch = keyMatch.slice(0, this.notes.length);
	  this.updateNotes = options.updateNotes;
	}
	
	Keyboard.prototype.showKeys = function () {
	  this.notes.forEach(note => {
	    console.log(note);
	  });
	};
	
	
	Keyboard.prototype.setup = function (el) {
	  const boardEl = document.createElement('div');
	  boardEl.style = 'keyboard';
	  this.notes.forEach((note, idx) => {
	    let newKey = document.createElement('span');
	    newKey.style = "key";
	    newKey.innerHTML = note.name;
	    boardEl.appendChild(newKey);
	  });
	
	  document.addEventListener("keydown", this.keydown.bind(this));
	
	  document.addEventListener("keyup", this.keyup.bind(this));
	
	  el.appendChild(boardEl);
	};
	
	
	Keyboard.prototype.keydown = function(event) {
	  event.preventDefault();
	  let idx = this.keyMatch.indexOf(event.code);
	  if (idx > -1) {
	    this.notes[idx].start();
	    this.updateNotes(this.notes[idx].name);
	  }
	};
	
	Keyboard.prototype.keyup = function(event){
	  event.preventDefault();
	  let idx = this.keyMatch.indexOf(event.code);
	  if (idx > -1) {
	    this.notes[idx].stop();
	  }
	};
	
	
	
	module.exports = Keyboard;
	window.Keyboard = Keyboard;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const freq = __webpack_require__(8);
	const audioContext = __webpack_require__(9);
	
	function Note (name){
	  this.name = name;
	  this.osc = audioContext.createOscillator();
	  this.osc.frequency.value = freq[name];
	  this.gainNode = audioContext.createGain();
	  this.gainNode.gain.value = 0;
	  this.osc.connect(this.gainNode);
	  this.gainNode.connect(audioContext.destination);
	  this.osc.start(0);
	}
	
	Note.prototype.start = function(){
	  // this.osc.connect(audioContext.destination);
	  // when connecting/disconnecting to 'destination' to start/stop the note,
	  // it made unplesant noise. Controlling gained worked better in terms of
	  // sound quality.
	  this.gainNode.gain.value = 0.3;
	};
	
	Note.prototype.stop = function(){
	  // this.osc.disconnect(audioContext.destination);
	  this.gainNode.gain.value = 0;
	};
	
	Note.prototype.frequency = function () {
	  return freq[this.name];
	};
	
	module.exports = Note;
	window.Note = Note;


/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = {
	  C0:	16.35,
	  Db0:	17.32,
	  D0:	18.35,
	  Eb0:	19.45,
	  E0:	20.60,
	  F0:	21.83,
	  Gb0:	23.12,
	  G0:	24.50,
	  Ab0:	25.96,
	  A0:	27.50,
	  Bb0:	29.14,
	  B0:	30.87,
	  C1:	32.70,
	  Db1:	34.65,
	  D1:	36.71,
	  Eb1:	38.89,
	  E1:	41.20,
	  F1:	43.65,
	  Gb1:	46.25,
	  G1:	49.00,
	  Ab1:	51.91,
	  A1:	55.00,
	  Bb1:	58.27,
	  B1:	61.74,
	  C2:	65.41,
	  Db2:	69.30,
	  D2:	73.42,
	  Eb2:	77.78,
	  E2:	82.41,
	  F2:	87.31,
	  Gb2:	92.50,
	  G2:	98.00,
	  Ab2:	103.83,
	  A2: 110.00,
	  Bb2: 116.54,
	  B2: 123.47,
	  C3: 130.81,
	  Db3: 138.59,
	  D3:	146.83,
	  Eb3: 155.56,
	  E3:	164.81,
	  F3:	174.61,
	  Gb3: 185.00,
	  G3:	196.00,
	  Ab3: 207.65,
	  A3:	220.00,
	  Bb3: 233.08,
	  B3:	246.94,
	  C4:	261.63,
	  Db4: 277.18,
	  D4:	293.66,
	  Eb4: 311.13,
	  E4:	329.63,
	  F4:	349.23,
	  Gb4: 369.99,
	  G4:	392.00,
	  Ab4: 415.30,
	  A4:	440.00,
	  Bb4: 466.16,
	  B4:	493.88,
	  C5:	523.25,
	  Db5: 554.37,
	  D5:	587.33,
	  Eb5: 622.25,
	  E5:	659.25,
	  F5:	698.46,
	  Gb5: 739.99,
	  G5:	783.99,
	  Ab5: 830.61,
	  A5:	880.00,
	  Bb5: 932.33,
	  B5:	987.77,
	  C6:	1046.50,
	  Db6: 1108.73,
	  D6:	1174.66,
	  Eb6: 1244.51,
	  E6:	1318.51,
	  F6:	1396.91,
	  Gb6: 1479.98,
	  G6:	1567.98,
	  Ab6: 1661.22,
	  A6:	1760.00,
	  Bb6: 1864.66,
	  B6:	1975.53,
	  C7:	2093.00,
	  Db7: 2217.46,
	  D7:	2349.32,
	  Eb7: 2489.02,
	  E7:	2637.02,
	  F7:	2793.83,
	  Gb7: 2959.96,
	  G7:	3135.96,
	  Ab7: 3322.44,
	  A7:	3520.00,
	  Bb7: 3729.31,
	  B7:	3951.07,
	  C8:	4186.01,
	  Db8: 4434.92,
	  D8:	4698.63,
	  Eb8: 4978.03,
	  E8:	5274.04,
	  F8:	5587.65,
	  Gb8: 5919.91,
	  G8:	6271.93,
	  Ab8: 6644.88,
	  A8:	7040.00,
	  Bb8: 7458.62,
	  B8:	7902.13
	};


/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = new (window.AudioContext || window.webkitAudioContext)();


/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = {
	  major: [0, 2, 2, 1, 2, 2, 2, 1],
	  minor: [0, 2, 1, 2, 2, 1, 2, 2]
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	const DrumSounds = __webpack_require__(12);
	const audioContext = __webpack_require__(9);
	
	function KickDrum (){
	
	}
	
	KickDrum.prototype.name = function(){
	  return "Kick Drum";
	};
	
	KickDrum.prototype.start = function() {
	  this.osc = audioContext.createOscillator();
	  this.gainNode = audioContext.createGain();
	  this.osc.connect(this.gainNode);
	  this.gainNode.connect(audioContext.destination);
	
	  const now = audioContext.currentTime;
	
	  this.osc.frequency.setValueAtTime(150, now);
		this.gainNode.gain.setValueAtTime(2, now);
	
		this.osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
		this.gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
		this.osc.start(now);
	
		this.osc.stop(now + 0.5);
	};
	
	KickDrum.prototype.stop = function () {
	  // does nothing
	};
	
	module.exports = {
	  KickDrum: KickDrum
	};


/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = {
	  kickDrum: {
	    freq: 150
	  }
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	const KickDrum = __webpack_require__(11).KickDrum;
	const BeatPatterns = __webpack_require__(14);
	
	function BeatMaker(options){
	  this.tempo = options.tempo;
	  this.pattern = BeatPatterns[options.pattern];
	  this.emitNotes = options.emitNotes;
	  this.setListenStatus = options.setListenStatus;
	  this.drum = new KickDrum;
	}
	
	BeatMaker.prototype.setup = function(parentEl){
	  let startButton = document.createElement('button');
	
	  startButton.innerHTML = "start beat";
	  startButton.addEventListener("click", function(event){
	    event.preventDefault();
	    this.start();
	  }.bind(this));
	  parentEl.appendChild(startButton);
	
	  let stopButton = document.createElement('button');
	  stopButton.innerHTML = "stop beat";
	  stopButton.addEventListener("click", function(event){
	    event.preventDefault();
	    this.stop();
	  }.bind(this));
	  parentEl.appendChild(stopButton);
	};
	
	BeatMaker.prototype.manageBeat = function () {
	  this.idx = this.idx || 0;
	  if (this.pattern[this.idx]){
	    this.drum.start();
	    this.emitNotes();
	  }
	  this.idx = (this.idx === this.pattern.length - 1) ? 0 : this.idx + 1;
	};
	
	
	BeatMaker.prototype.start = function () {
	  this.setListenStatus(true);
	  let interval = (this.tempo / 60) / (this.pattern.length / 4) * 1000;
	  this.currentBeat = setInterval(this.manageBeat.bind(this), interval);
	};
	
	BeatMaker.prototype.stop = function () {
	  this.setListenStatus(false);
	  if (this.currentBeat) { clearInterval(this.currentBeat); }
	};
	
	
	module.exports = BeatMaker;


/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = {
	  FourBeat: [1,1,1,1],
	  FourBeat2: [0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1]
	};
	// each array is one bar


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	const MusicTracker = __webpack_require__(5);
	const Canvas = __webpack_require__(1);
	
	function GameUI(){
	};
	
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
	  this.canvas = new Canvas(dims);
	};
	
	
	
	module.exports = GameUI;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map