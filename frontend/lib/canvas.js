const Circle = require('./circle.js');
const Colors = require('../constants/colors.js');
const Transpose = require('../utils/transpose.js');
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
