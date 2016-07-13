const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
module.exports = {
  interval(noteA, noteB){
    const _noteA = noteA.match(/([A-Gb]+)(\d)/);
    const _noteB = noteB.match(/([A-Gb]+)(\d)/);
    let hNote, hNum, lNote, lNum;

    if(
      ( notes.indexOf(_noteB[1]) > notes.indexOf(_noteA[1]) && _noteB[2] === _noteA[2] ) ||
      (_noteB[2] > _noteA[2])){
      lNote = _noteA[1]; lNum = _noteA[2];
      hNote = _noteB[1]; hNum = _noteB[2];
    } else {
      hNote = _noteA[1]; hNum = _noteA[2];
      lNote = _noteB[1]; lNum = _noteB[2];
    }

    return notes.indexOf(hNote) - notes.indexOf(lNote) + ((hNum - lNum) * 12);
  },

  getNote(root, interval){
    const _root = root.match(/([A-Gb]+)(\d)/);
    const rNote = _root[1];
    const rNum = _root[2];

    const rIdx = notes.indexOf(rNote);
    return notes[(rIdx + interval)%12] + (parseInt(rNum) + Math.floor((rIdx + interval)/12)).toString();

  }
}
