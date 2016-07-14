const Dir = {
  0: {
    up: [1,0],
    down: [1,0]
  },
  1: {
    up: [1,0],
    down: [0,-1]
  },
  2: {
    up: [-1,0],
    down: [0,-1]
  },
  3: {
    up: [-1,0],
    down: [-1,0]
  },
  4: {
    up: [0,1],
    down: [-1,0]
  },
  5: {
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
  if (this.color === '#FFFFFF'){ this.pos = 0; return; }
  const dir = ((this.pos[0] + this.pos[1]) % 2) ? 'down' : 'up';
  this.pos = [this.pos[0] + this.path[dir][0], this.pos[1] + this.path[dir][1]];
};

module.exports = ColorTile;
