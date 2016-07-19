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
