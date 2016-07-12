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

	const Field = __webpack_require__(1);
	const Note = __webpack_require__(3);
	const Keyboard = __webpack_require__(5);
	
	document.addEventListener("DOMContentLoaded", function(){
	  const canvasEl = document.getElementById('canvas');
	  const ctx = canvasEl.getContext('2d');
	  const field = new Field(
	    [canvasEl.width, canvasEl.height]
	  ).animate(ctx);
	
	  const keyboarFrame = document.getElementById('keyboard-frame');
	  const keyboard = new Keyboard('major', 'C4');
	  keyboard.render(keyboarFrame);
	
	
	})


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Circle = __webpack_require__(2);
	
	const options = {
	  pos: [100, 100],
	  vel: [1,1],
	  rad: 10,
	  color: 'red'
	}
	
	function Field (dims){
	  this.dims = dims;
	  this.circles = [new Circle (options)];
	}
	
	Field.prototype.render = function (ctx) {
	  ctx.clearRect(0, 0, this.dims[0], this.dims[1]);
	  this.circles.forEach( circle => {
	    circle.move();
	    circle.draw(ctx);
	  })
	};
	
	Field.prototype.animate = function(ctx){
	  setInterval(this.render.bind(this, ctx), 1000);
	}
	
	module.exports = Field;


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
/***/ function(module, exports, __webpack_require__) {

	const freq = __webpack_require__(4);
	const audioContext = new (window.AudioContext || window.webkitAudioContext)();
	
	function Note (noteName){
	  this.noteName = noteName;
	  this.osc = audioContext.createOscillator();
	  this.osc.frequency.value = freq[noteName];
	  this.gainNode = audioContext.createGain();
	  this.gainNode.gain.value = 0;
	  this.osc.connect(this.gainNode);
	  this.gainNode.connect(audioContext.destination);
	  this.osc.start(0);
	}
	
	Note.prototype.start = function(){
	  // this.osc.connect(audioContext.destination);
	  this.gainNode.gain.value = 0.3;
	  console.log(this.noteName);
	};
	
	Note.prototype.stop = function(){
	  // this.osc.disconnect(audioContext.destination);
	  this.gainNode.gain.value = 0;
	};
	
	Note.prototype.name = function(){
	  return this.noteName;
	};
	
	Note.prototype.frequency = function () {
	  return freq[this.noteName];
	};
	
	// Note.play = function(noteName){
	//   const note = new Note(noteName);
	//   return note.start();
	// }
	
	module.exports = Note;


/***/ },
/* 4 */
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
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Note = __webpack_require__(3);
	const Scales = __webpack_require__(6);
	const Transpose = __webpack_require__(7);
	
	const keyMatch = ['KeyA','KeyS','KeyD','KeyF','KeyF','KeyH','KeyJ','KeyK','KeyL'];
	
	
	function generateNotes(scale, rootNote){
	  let allNotes = [];
	  let totalInt = 0;
	  for (let i = 0; i < Scales[scale].length; i++){
	    totalInt += Scales[scale][i];
	    let newNoteName = Transpose.getNote(rootNote, totalInt);
	    allNotes.push(new Note(newNoteName));
	  }
	  return allNotes;
	}
	
	
	function Keyboard(scale, rootNote, octav){
	  this.notes = generateNotes(scale, rootNote);
	  this.keyMatch = keyMatch.slice(0, this.notes.length);
	}
	
	Keyboard.prototype.showKeys = function () {
	  this.notes.forEach(note => {
	    console.log(note);
	  });
	};
	
	Keyboard.prototype.render = function (el) {
	  const boardEl = document.createElement('div');
	  boardEl.style = 'keyboard';
	  this.notes.forEach((note, idx) => {
	    let newKey = document.createElement('span');
	    newKey.style = "key";
	    newKey.innerHTML = note.name();
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
/* 6 */
/***/ function(module, exports) {

	module.exports = {
	  major: [0, 2, 2, 1, 2, 2, 2, 1],
	  minor: [0, 2, 1, 2, 2, 1, 2, 2]
	}


/***/ },
/* 7 */
/***/ function(module, exports) {

	const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
	module.exports = {
	  interval(low, high){
	    const _low = low.match(/([A-Gb]+)(\d)/);
	    const lNote = _low[1];
	    const lNum = _low[2];
	
	    const _high = high.match(/([A-Gb]+)(\d)/);
	    const hNote = _high[1];
	    const hNum = _high[2];
	
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map