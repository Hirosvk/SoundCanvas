function KeyboardPlayer(scale, root){
  this.playingNotes = {};
  this.notes = Transpose.generateNotes(scale, root);
  this.notes.forEach(note => {
    this.playingNotes[note] = [];
  })
}

module.exports = KeyboarPlayer;
