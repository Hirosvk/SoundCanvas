const Circle = require('./lib/circle.js');

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
