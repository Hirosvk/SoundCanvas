const ColorBlender = require('../utils/color_blender.js');

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
}; // called right after render

Triangle.prototype.receiveColorTile = function (colorTile) {
  for (let i = 0; i < 3; i++) {this.inColors.push(colorTile.color);}
  this.colorTiles.push(colorTile);
}; // called after render


module.exports = Triangle;
window.Triangle = Triangle;
