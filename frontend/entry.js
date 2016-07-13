const Canvas = require('./lib/canvas.js');
const MusicTracker = require('./lib/music_tracker.js');
const GameUI = require('./lib/game_ui.js');

document.addEventListener("DOMContentLoaded", function(){
  const gameUI = new GameUI();

  const canvasEl = document.getElementById('canvas');
  gameUI.setupCanvas(canvasEl, [canvasEl.width, canvasEl.height]);

  const musicFrame = document.getElementById('music-tracker');
  musicOptions = {
    keyboard:  {
      scale: "major",
      root: "C4"
    },
    beatMaker: {
      tempo: 60,
      pattern: "FourBeat"
    }
  }
  gameUI.setupMusicTracker(musicFrame, musicOptions);

});
