const Circle = require('./circle.js');

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
