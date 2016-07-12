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

	const Circle = __webpack_require__(1);
	
	document.addEventListener("DOMContentLoaded", function(){
	  const canvasEl = document.getElementById('canvas');
	  const field = canvasEl.getContext('2d');
	
	  const options = {
	    pos: [100, 100],
	    vel: [1,1],
	    rad: 10,
	    color: 'red'
	  }
	
	  const circle1 = new Circle (options)
	
	  setInterval(function(field){
	    circle1.move();
	    circle1.render()
	  }.bind(this, field), 1000)
	
	})


/***/ },
/* 1 */
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
	
	Circle.prototype.render = function(ctx){
	  ctx.beginPath();
	  ctx.arc(this.pos[0], this.pos[1], this.rad, 0, Math.PI * 2);
	  ctx.fillStyle = this.color;
	  ctx.fill();
	}
	
	module.exports = Circle;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map