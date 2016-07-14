function MusicPlayer(scale, root){
  


  this.playingNotes = {};
  this.notes = Transpose.generateNotes(scale, root);
  this.notes.forEach(note => {
    this.playingNotes[note] = [];
  })
}

MusicPlayer.prototype.setup = function () {
  // setup functions with keyboard and beatMaker
};



module.exports = MusicPlayer;
