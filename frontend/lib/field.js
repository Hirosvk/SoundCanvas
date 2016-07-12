const Circle = require('./circle.js');

const options = {
  pos: [100, 100],
  vel: [1,1],
  rad: 10,
  color: 'red'
}

const circle1 = new Circle (options)
circle1.render();
