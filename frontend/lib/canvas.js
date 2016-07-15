const Colors = require('../constants/colors.js');
const Transpose = require('../utils/transpose.js');
const Triangle = require('./triangle.js');
const ColorTile = require('./color_tile.js');

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
    let _notes = notes.slice();
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
