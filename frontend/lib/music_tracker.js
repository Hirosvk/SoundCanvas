

function MusicTracker (keyboardOptions, trackerOptions){
  this.trackerStore = [];
  keyboardOptions.trackerStore = this.trackerStore;
  this.keyboard = new Keyboard (keyboardOptions);
}
