const Field = require('./lib/field.js');
const Note = require('./lib/note.js');
const Keyboard = require('./lib/keyboard.js');
const BeatMaker = require('./lib/beat_maker.js');
const KickDrum = require('./lib/drum.js').KickDrum;

document.addEventListener("DOMContentLoaded", function(){
  const canvasEl = document.getElementById('canvas');
  const ctx = canvasEl.getContext('2d');
  const field = new Field(
    [canvasEl.width, canvasEl.height]
  ).animate(ctx);

  const keyboarFrame = document.getElementById('keyboard-frame');
  const keyboard = new Keyboard('major', 'C4');
  keyboard.render(keyboarFrame);
  const kickDrum = new KickDrum();
  const beatMaker = new BeatMaker(40, "FourBeat2", kickDrum);
  beatMaker.setup(document.getElementById('beat-maker'));


});
