Function.prototype.inherits = function (parent) {
  const Surrogate = function(){};
  Surrogate.prototype = parente.prototype;
  this.prototype = new Surrogate ();
  this.prototype.constructor = this
};
