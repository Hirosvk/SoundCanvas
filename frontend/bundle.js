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
	const MusicTracker = __webpack_require__(11);
	const GameUI = __webpack_require__(17);
	
	document.addEventListener("DOMContentLoaded", function(){
	  const gameUI = new GameUI();
	
	  const canvasEl = document.getElementById('canvas');
	  gameUI.setupCanvas(canvasEl, [canvasEl.width, canvasEl.height]);
	
	  const musicFrame = document.getElementById('music-tracker');
	  const musicOptions = {
	    keyboard:  {
	      scale: "major",
	      root: "C4"
	    },
	    beatMaker: {
	      tempo: 120,
	      pattern: "FourBeat2",
	      timeSig: 4
	    }
	  };
	  gameUI.setupMusicTracker(musicFrame, musicOptions);
	  gameUI.setupButtons(document.getElementById('dashboard'));
	
	  window.gameUI = gameUI;
	  window.canvas = gameUI.canvas;
	
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Colors = __webpack_require__(2);
	const Transpose = __webpack_require__(3);
	const Triangle = __webpack_require__(8);
	const ColorTile = __webpack_require__(10);
	
	let Center = [7,7];
	const Pos = [[-3,-3],[6,0],[-3,3],[3,-3],[-6,0],[3,3],[0,0]];
	const Dir = [[0,0],[-2, 0],[0,1],[-2, 1],[-1,0],[-1,1]];
	
	function Canvas(ctx, dims){
	  this.ctx = ctx;
	  this.dims = dims;
	  this.opX = this.add;
	  this.opY = this.add;
	}
	
	Canvas.prototype.setupGrid = function (triDim) {
	  this.grid = {};
	  this.triDim = triDim;
	  this.cosDim = Math.floor(triDim * 0.866);
	  this.xSize = Math.floor(this.dims[0]/this.triDim) * 2;
	  this.ySize = Math.floor(this.dims[1]/this.cosDim);
	
	  for (let y = 0; y <= this.ySize; y++){
	    for(let x = 0; x <= this.xSize + 1; x++){
	      this.grid[[x,y]] = new Triangle([x,y]);
	    }
	  }
	};
	
	Canvas.prototype.receiveNotes = function (notes) {
	  this.notesToTiles(notes);
	};
	
	Canvas.prototype.notesToTiles = function (notes){
	  let colors = this.generateColors(notes);
	  notes.forEach( (note, nIdx) => {
	    colors[note].forEach( (color, cIdx) => {
	      let newX = Center[0] + Pos[nIdx][0] + Dir[cIdx][0];
	      let newY = Center[1] + Pos[nIdx][1] + Dir[cIdx][1];
	      this.addColorTile([newX, newY], color, cIdx);
	      // max notes.length is 7, max colors.length is 6;
	    });
	  });
	  this.moveCenter(Math.floor(notes.length/2));
	};
	
	Canvas.prototype.moveCenter = function(diff){
	  let newX = this.opX(Center[0], diff);
	  if (newX > this.xSize - 7){
	    this.opX = this.sub;
	  } else if (newX < 7){
	    this.opX = this.add;
	  }
	  let newY = this.opY(Center[1], diff);
	  if (newY > this.ySize - 7){
	    this.opY = this.sub;
	  } else if (newY < 7){
	    this.opY = this.add;
	  }
	  Center = [newX, newY];
	};
	
	Canvas.prototype.add = function(n1, n2){
	  return n1 + n2;
	};
	
	Canvas.prototype.sub = function (n1, n2) {
	  return n1 - n2;
	};
	
	Canvas.prototype.addColorTile = function (pos, color, dirCode){
	  let tile = new ColorTile(pos, color, dirCode);
	  if (this.grid[pos]){
	    this.grid[pos].receiveColorTile(tile);
	  }
	};
	
	Canvas.prototype.generateColors = function (notes) {
	  let colors = {};
	  for(let i = 0; i < notes.length; i++){
	    _notes = notes.slice();
	    _notes.splice(i, 1);
	    colors[notes[i]] = _notes.map( _note => {
	      return Colors[Transpose.interval(notes[i], _note)]
	    })
	  }
	  return colors
	};
	
	
	
	Canvas.prototype.render = function () {
	  let anchor = [0,0];
	  let _x = 0;
	
	  for (let y = 0; y <= this.ySize; y++){
	    for(let x = 0; x <= this.xSize + 1; x++){
	      if (this.grid[[x+_x, y]]) {
	        let color = this.grid[[x+_x, y]].getColor();
	        if (color !== '#FFFFFF') {
	          if (x % 2 === 1){
	            this.ctx.beginPath();
	            this.ctx.moveTo(anchor[0], anchor[1]);
	            this.ctx.lineTo(anchor[0] + Math.floor(this.triDim/2), anchor[1] + this.cosDim);
	            this.ctx.lineTo(anchor[0] + this.triDim, anchor[1]);
	          } else {
	            this.ctx.beginPath();
	            this.ctx.moveTo(anchor[0], anchor[1]);
	            this.ctx.lineTo(anchor[0] - Math.floor(this.triDim/2), anchor[1] + this.cosDim);
	            this.ctx.lineTo(anchor[0] + Math.floor(this.triDim/2), anchor[1] + this.cosDim);
	          }
	          this.ctx.fillStyle = color;
	          this.ctx.fill();
	        }
	      }
	      anchor[0] += (this.triDim * (x % 2));
	    }
	    if (y % 2 === 0){
	      anchor[0] = -(Math.floor(this.triDim/2));
	      _x = -1;
	    } else {
	      anchor[0] = 0;
	      _x = 0;
	    }
	    anchor[1] += this.cosDim;
	  }
	};
	
	
	
	Canvas.prototype.moveColorTiles = function () {
	  let leavingTiles = [];
	  for (let y = 0; y <= this.ySize; y++){
	    for(let x = 0; x <= this.xSize + 1; x++){
	      leavingTiles = leavingTiles.concat(this.grid[[x,y]].emitColorTiles());
	    }
	  }
	  leavingTiles.forEach( tile => {
	    if (this.grid[tile.pos]){
	      this.grid[tile.pos].receiveColorTile(tile);
	    }
	  });
	};
	
	Canvas.prototype.renderFrame = function () {
	  this.render();
	  this.moveColorTiles();
	};
	
	Canvas.prototype.animate = function(){
	  this.animation = setInterval(this.renderFrame.bind(this), 100);
	};
	
	Canvas.prototype.stopAnimation = function(){
	  clearInterval(this.animation);
	};
	
	Canvas.prototype.clearCanvas = function(){
	  this.ctx.clearRect(0,0,this.dims[0],this.dims[1])
	};
	
	module.exports = Canvas;
	window.Canvas = Canvas;


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = {
	  0: '#000000',
	  1: '#000000',
	  2: '#FF0080', //2
	  3: '#00FFFF', //-3
	  4: '#FFFF00', //3
	  5: '#0000FF', //4
	  6: '#8000FF', //tritone
	  7: '#FF0000', //5
	  8: '#FF00FF', //-6
	  9: '#00FF00', //6
	  10: '#0080FF', //-7
	  11: '#00FF80',
	  12: '#FF8000',
	  14: '#80FF00'//9th
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
	const Scales = __webpack_require__(4);
	const Note = __webpack_require__(5);
	
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
	  },
	
	  generateNotes(scale, root){
	    let allNotes = [];
	    let totalInt = 0;
	    for (let i = 0; i < Scales[scale].length; i++){
	      totalInt += Scales[scale][i];
	      let newNoteName = this.getNote(root, totalInt);
	      allNotes.push(new Note(newNoteName));
	    }
	    return allNotes;
	  }
	
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = {
	  major: [0, 2, 2, 1, 2, 2, 2, 1],
	  minor: [0, 2, 1, 2, 2, 1, 2, 2]
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const freq = __webpack_require__(6);
	const audioContext = __webpack_require__(7);
	
	function Note (name){
	  this.name = name;
	  this.osc = audioContext.createOscillator();
	  this.osc.frequency.value = freq[name];
	  this.gainNode = audioContext.createGain();
	  this.gainNode.gain.value = 0;
	  this.osc.connect(this.gainNode);
	  this.gainNode.connect(audioContext.destination);
	  this.osc.start(0);
	
	  this.playing = false;
	}
	
	Note.prototype.start = function(){
	  // this.osc.connect(audioContext.destination);
	  // when connecting/disconnecting to 'destination' to start/stop the note,
	  // it made unplesant noise. Controlling gained worked better in terms of
	  // sound quality.
	  if (!this.playing){
	    this.gainNode.gain.value = 0.3;
	    this.playing = true;
	    return true;
	  }
	  return false;
	};
	
	Note.prototype.stop = function(){
	  // this.osc.disconnect(audioContext.destination);
	  this.gainNode.gain.value = 0;
	  this.playing = false;
	};
	
	Note.prototype.frequency = function () {
	  return freq[this.name];
	};
	
	module.exports = Note;
	window.Note = Note;


/***/ },
/* 6 */
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
/* 7 */
/***/ function(module, exports) {

	module.exports = new (window.AudioContext || window.webkitAudioContext)();


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	const ColorBlender = __webpack_require__(9);
	
	function Triangle(pos){
	  this.pos = pos;
	  this.reset();
	}
	
	Triangle.prototype.reset = function () {
	  this.color = '#FFFFFF';
	  this.colorTiles = [];
	  this.inColors = ['#FFFFFF'];
	};
	
	Triangle.prototype.getColor = function () {
	  this.color = ColorBlender.blend(this.inColors); // called on render
	  return this.color;
	};
	
	
	Triangle.prototype.emitColorTiles = function () {
	  const leavingTiles = this.colorTiles.map( tile => {
	    tile.color = this.color;
	    tile.newPos();
	    return tile;
	  });
	  this.reset();
	  return leavingTiles.filter(function(tile){
	    if (!tile.pos) { return false; }
	    return true;
	  });
	};
	
	Triangle.prototype.receiveColorTile = function (colorTile) {
	  for (let i = 0; i < 3; i++) {this.inColors.push(colorTile.color);}
	  this.colorTiles.push(colorTile);
	}; 
	
	module.exports = Triangle;
	window.Triangle = Triangle;


/***/ },
/* 9 */
/***/ function(module, exports) {

	const ColorBlender = {
	  blend(colors){
	    let r = 0, g = 0, b = 0;
	    colors.forEach(color => {
	      r += this.toBase10Int(color[1])*16 + this.toBase10Int(color[2]);
	      g += this.toBase10Int(color[3])*16 + this.toBase10Int(color[4]);
	      b += this.toBase10Int(color[5])*16 + this.toBase10Int(color[6]);
	    });
	    let mR = parseInt(r/colors.length);
	    let resultR = this.toHex(parseInt(mR / 16)) + this.toHex(mR % 16);
	    let mG = parseInt(g/colors.length);
	    let resultG = this.toHex(parseInt(mG / 16)) + this.toHex(mG % 16);
	
	    let mB = parseInt(b/colors.length);
	    let resultB = this.toHex(parseInt(mB / 16)) + this.toHex(mB % 16);
	    return `#${resultR}${resultG}${resultB}`;
	  },
	
	  toBase10Int(hex){
	    if (hex.match(/\d/)){
	      return parseInt(hex);
	    } else {
	      return hex.charCodeAt(0) - 55;
	    }
	  },
	
	  toHex(int){
	    if (int < 10){
	      return int.toString();
	    } else {
	      return String.fromCharCode(int + 55);
	    }
	  }
	};
	
	module.exports = ColorBlender;


/***/ },
/* 10 */
/***/ function(module, exports) {

	const Dir = {
	  0: {
	    up: [1,0],
	    down: [1,0]
	  },
	  4: {
	    up: [1,0],
	    down: [0,-1]
	  },
	  1: {
	    up: [-1,0],
	    down: [0,-1]
	  },
	  3: {
	    up: [-1,0],
	    down: [-1,0]
	  },
	  5: {
	    up: [0,1],
	    down: [-1,0]
	  },
	  2: {
	    up: [0,1],
	    down: [1,0]
	  }
	};
	
	
	function ColorTile(pos, color, dirCode){
	  this.pos = pos;
	  this.color = color;
	  this.path = Dir[dirCode];
	}
	
	ColorTile.prototype.newPos = function () {
	  if (this.color === '#FFFFFF') { this.pos = 0; return; }
	  const dir = ((this.pos[0] + this.pos[1]) % 2) ? 'down' : 'up';
	  // const newX = this.pos[0] + this.path[dir][0];
	  // const newY = this.pos[1] + this.path[dir][1]
	  this.pos = [this.pos[0] + this.path[dir][0], this.pos[1] + this.path[dir][1]];
	};
	
	module.exports = ColorTile;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	const Keyboard = __webpack_require__(12);
	const BeatMaker = __webpack_require__(15);
	
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


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	const Note = __webpack_require__(5);
	const Scales = __webpack_require__(4);
	const Transpose = __webpack_require__(3);
	const KickDrum = __webpack_require__(13).KickDrum;
	
	const keyMatch = ['KeyA','KeyS','KeyD','KeyF','KeyG','KeyH','KeyJ','KeyK','KeyL'];
	
	
	function Keyboard(options, track, trackOptions){
	  this.notes = Transpose.generateNotes(options.scale, options.root);
	  this.keyMatch = keyMatch.slice(0, this.notes.length);
	  this.updateNotes = options.updateNotes;
	}
	
	Keyboard.prototype.loadTrack = function (track, trackOptions){
	  this.track = track;
	  this.trackOptions = {
	    tempo: trackOptions.tempo,
	    timeSig: trackOptions.timeSig
	  };
	};
	
	Keyboard.prototype.unloadTrack = function () {
	  this.track = undefined;
	  this.trackOptions = undefined;
	};
	
	Keyboard.prototype.showKeys = function () {
	  this.notes.forEach(note => {
	    console.log(note);
	  });
	};
	
	
	Keyboard.prototype.setupKeys = function (keyboardEl) {
	  const boardEl = document.createElement('div');
	  boardEl.style = 'keyboard';
	  this.notes.forEach((note, idx) => {
	    let newKey = document.createElement('span');
	    newKey.style = "key";
	    newKey.innerHTML = `${note.name} : ${this.keyMatch[idx]}`;
	    newKey.id = idx
	    newKey.addEventListener("mousedown", this.pressKey.bind(this));
	    newKey.addEventListener("mouseup", this.releaseKey.bind(this));
	    newKey.addEventListener("mouseout", this.releaseKey.bind(this));
	    boardEl.appendChild(newKey);
	  });
	
	  document.addEventListener("keydown", this.keydown.bind(this));
	
	  document.addEventListener("keyup", this.keyup.bind(this));
	
	  keyboardEl.appendChild(boardEl);
	};
	
	Keyboard.prototype.pressKey = function (event){
	  this.keydown(parseInt(event.target.id));
	};
	
	Keyboard.prototype.releaseKey = function (event) {
	  this.keyup(parseInt(event.target.id));
	};
	
	Keyboard.prototype.keydown = function(event) {
	  let idx;
	  if (typeof event === 'number') {
	    idx = event;
	  } else {
	    event.preventDefault();
	    idx = this.keyMatch.indexOf(event.code);
	  }
	
	  if (idx > -1) {
	    if (this.notes[idx].start()){
	      this.updateNotes(this.notes[idx].name);
	    }
	  }
	};
	
	Keyboard.prototype.keyup = function(event){
	  let idx;
	  if (typeof event === 'number') {
	    idx = event;
	  } else {
	    event.preventDefault();
	    idx = this.keyMatch.indexOf(event.code);
	  }
	  if (idx > -1) {
	    this.notes[idx].stop();
	  }
	};
	
	
	Keyboard.prototype.managePlayback = function(){
	  this.barIdx = this.barIdx || 0;
	  this.noteIdx = this.noteIdx || 0;
	  this.keyMatch.forEach( (key, idx) => {
	    if (this.track[idx]){
	      let note = this.track[idx][this.barIdx][this.noteIdx];
	      if (note) {
	        this.keydown(idx);
	      } else {
	        this.keyup(idx);
	      }
	    }
	  })
	  // update indices below
	  if (this.noteIdx === this.track.noteLength - 1){
	    this.noteIdx = 0;
	    if (this.barIdx === this.track.barLength - 1){
	      this.barIdx = 0;
	    } else {
	      this.barIdx++;
	    }
	  } else {
	    this.noteIdx++;
	  }
	};
	
	Keyboard.prototype.playTrack = function(){
	  if (this.track){
	    let interval = 1000 /
	        (this.track.noteLength / this.trackOptions.timeSig) *
	        (60/this.trackOptions.tempo);
	    this.currentTrack = setInterval(this.managePlayback.bind(this), interval);
	  }
	};
	
	Keyboard.prototype.stopTrack = function () {
	  clearInterval(this.currentTrack);
	  this.clearNotes();
	};
	
	Keyboard.prototype.clearNotes = function () {
	  this.keyMatch.forEach((key, idx) => {
	    this.notes[idx].stop();
	  })
	};
	
	
	module.exports = Keyboard;
	window.Keyboard = Keyboard;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	const DrumSounds = __webpack_require__(14);
	const audioContext = __webpack_require__(7);
	
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
/* 14 */
/***/ function(module, exports) {

	module.exports = {
	  kickDrum: {
	    freq: 150
	  }
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	const KickDrum = __webpack_require__(13).KickDrum;
	const BeatPatterns = __webpack_require__(16);
	
	function BeatMaker(options){
	  this.tempo = options.tempo;
	  this.pattern = BeatPatterns[options.pattern];
	  this.timeSig = options.timeSig;
	
	  this.emitNotes = options.emitNotes;
	  this.clearStore = options.clearStore;
	  this.setListenStatus = options.setListenStatus;
	  this.drum = new KickDrum;
	}
	
	BeatMaker.prototype.manageBeat = function () {
	  this.barIdx = this.barIdx || 0;
	  this.beatIdx = this.beatIdx || 0;
	  if (this.pattern[this.barIdx][this.beatIdx]){
	    this.drum.start();
	    this.emitNotes();
	  }
	  // update indices below
	  if (this.beatIdx === this.pattern[0].length - 1){
	    this.beatIdx = 0;
	    this.clearStore();
	    if (this.barIdx === this.pattern.length - 1){
	      this.barIdx = 0;
	    } else {
	      this.barIdx++;
	    }
	  } else {
	    this.beatIdx++;
	  }
	};
	
	
	BeatMaker.prototype.start = function () {
	  this.setListenStatus(true);
	  let interval = 1000 / (this.pattern[0].length / this.timeSig) * (60/this.tempo);
	  console.log(interval);
	  this.currentBeat = setInterval(this.manageBeat.bind(this), interval);
	};
	
	BeatMaker.prototype.stop = function () {
	  this.setListenStatus(false);
	  if (this.currentBeat) { clearInterval(this.currentBeat); }
	};
	
	
	module.exports = BeatMaker;


/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = {
	  FourBeat: [[1,1,1,1]],
	  FourBeat2: [[0,0,1,1,0,1,0,1],[0,0,1,1,0,1,1,1]]
	};
	// each array is one bar


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	const MusicTracker = __webpack_require__(11);
	const Canvas = __webpack_require__(1);
	const Tracks = __webpack_require__(18);
	
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


/***/ },
/* 18 */
/***/ function(module, exports) {

	const WhenTheSaintGoMarchingIn = {
	  0: [
	    [0,1,0,0],[0,0,0,0]
	  ],
	  1: [
	    [0,0,0,0],[0,0,0,0]
	  ],
	  2: [
	    [0,0,1,0],[0,0,0,0]
	  ],
	  3: [
	    [0,0,0,1],[0,0,0,0]
	  ],
	  4: [
	    [0,0,0,0],[1,0,0,0]
	  ],
	  5: [
	    [0,0,0,0],[0,0,0,0]
	  ],
	  6: [
	    [0,0,0,0],[0,0,0,0]
	  ],
	  barLength: 2,
	  noteLength: 4
	}
	
	module.exports = {
	  WhenTheSaintGoMarchingIn: WhenTheSaintGoMarchingIn
	}
	
	window.WhenTheSaintGoMarchingIn = WhenTheSaintGoMarchingIn
	window.options = {
	  tempo: 60,
	  timeSig: 4
	}


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map