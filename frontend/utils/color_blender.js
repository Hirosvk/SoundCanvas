const ColorBlender = {
  blend(colors){
    let r = 0, g = 0, b = 0;
    colors.forEach(color => {
      r += this.toBase10Int(color[1])*16 + this.toBase10Int(color[2]);
      g += this.toBase10Int(color[3])*16 + this.toBase10Int(color[4]);
      b += this.toBase10Int(color[5])*16 + this.toBase10Int(color[6]);
    });
    let mR = parseInt(r/colors.length);
    let resultR = this.toHex(parseInt(mR / 16)) + this.toHex(mR % 16);
    let mG = parseInt(g/colors.length);
    let resultG = this.toHex(parseInt(mG / 16)) + this.toHex(mG % 16);

    let mB = parseInt(b/colors.length);
    let resultB = this.toHex(parseInt(mB / 16)) + this.toHex(mB % 16);
    return `#${resultR}${resultG}${resultB}`;
  },

  toBase10Int(hex){
    if (hex.match(/\d/)){
      return parseInt(hex);
    } else {
      return hex.charCodeAt(0) - 55;
    }
  },

  toHex(int){
    if (int < 10){
      return int.toString();
    } else {
      return String.fromCharCode(int + 55);
    }
  }
};

module.exports = ColorBlender;
