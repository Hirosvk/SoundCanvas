const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
module.exports = {
  interval(low, high){
    const _low = low.match(/([A-Gb]+)(\d)/);
    const lNote = _low[1];
    const lNum = _low[2];

    const _high = high.match(/([A-Gb]+)(\d)/);
    const hNote = _high[1];
    const hNum = _high[2];

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
