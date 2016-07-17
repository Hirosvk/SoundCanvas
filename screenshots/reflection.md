## App Structure
 the app is divided into two main components; 'Canvas' and 'MusicTracker'. Canvas takes care of the render logic of the triangular grid. 'MusicTracker' takes care of the playing and capturing of the notes being played. Both classes are managed by GameUI class, that handles UI.

### Canvas
Canvas lays out triangular grid system on initialization of the Canvas object based on the <canvas> dimensions set on the index.html file.

In each grid block lives Triangle object, which holds one or more ColorTile objects. The ColorTile object keeps its color and moving direction.

On every beat, MusicTracker emits an array of notes currently playing. Canvas receives the notes and generates a series of ColorTiles. The arrangement of the notes determines the colors, initial grid position, and moving directions of the new ColorTiles.

On each render, the Triangle object generates the new color by blending the colors of the all ColorTiles it holds. After every render, the ColorTiles move to the adjacent Triangles according to its moving direction. As they leave their current Triangle, they are given the color of the previous Triangle.

Since all Triangle contains a white Tile as default, ColorTile's color fades into whiter shade on each render. When it's color turns completely white, the ColorTile object will not be passed to the next Triangle to reduce the render load.

On the initial design, the canvas was clearRect'ed on every render, but the colors disappeared too quickly, and the Canvas did not appear responsive to the user's play. On the current implementation, clearRect is not called, and color on the grid is not updated until next new ColorTile comes in. This way, the some ColorTiles linger on the Canvas, and results in more responsive and engaging UX.


## MusicTracker

MusicTracker handles higher level functions of music playing and notes capturing. Keyboard class and BeatMaker class are the two components of MusicTracker.

### Note Capturing
MusicTracker keeps all the played notes in a queue (trackerStore). Every time any note is played, it is pushed to the array up to 6 notes (this functionality is handled in Keyboard class). As 7th note is added to the queue, the first in the queue is shifted out. BeatMaker calls resetStore() at the end of every bar, which resets to an empty array.

GameUI passes a function 'passNotesToUI' to MusicTracker when MusicTracker constructor is called. 'passNotestoUI' is invoked when every beat hits, passing the current content of the trackerStore to Canvas.

### Music Playing
When the user clicks 'Activate Canvas' button, GameUI resets MusicTracker with the new options (tempo, scale, root, and track(demo track)). The reset() function will initializes new Keyboard and BeatMaker classes. It also removes previous keyboard event listeners. (notice that, in Keyboard class, before installing keyboard event listeners, references to the keydown/keyup are created. This is so that removeEventListenr can correctly remove the keyboard event listeners. keydown.bind(this) = keydown.bind(this) ==> false.) If the canvas is activated without demo track, track is undefined.

Keyboard initializes with scale, root, and HTMLElement. On initialize, it generates a set of available notes, and append keys to the HTMLElement with event listeners to enable playing through keyboard and mouse clicking.

MusicTracker calculates the interval between notes from the tempo and time signature, and calls setInterval with beatMaker.manageBeat. The BeatMaker functions plays the beat pattern dictated on beat_pattern.js file.

### Playback
When the user selects a demo track and clicks "Watch Demo", GameUI calls the same MusicTracker.reset() function, with 'track'. Playback process is the same as playing, with an exception that Keyboard does not install keyboard event listeners and Keyboard.prototype.managePlayback is called. Keyboard.prototype.managePlayback employs the same process as the Beatmaker.prototype.manageBeat.

notes:
First I setup setInterval only on the beat. As I implemented playback feature, I had to shifted up to MusicTracker class.

### Playing notes through AudioContext
Each Note has an oscillatorNode connected to a gainNode, and to the audioContext.destination. When the Note object is created, oscillator starts emitting the sound with the gainNode's gain set to zero. When the note is played (though function start()), the gain is set to 0.3. When stop() is called, the gain is set back to zero.

notes:
I first tried this just with oscillators; on start(), connect the oscillator to the destination, and disconnect on stop(). However, it created a harse unpleasant sounds on connect/disconnect. The current implementation works fine, but I plan to optimize it further by creating a new oscillator on every time the note plays.

## Beat Patterns / Demo Track format
SoundCanvas's beat patterns are coded as a nested array of digits 1 and 0. Within the wrapping array, each array represent a bar, and each digit represent a 1/8 note. On 1, BeatMaker makes the KickDrum beat, while it does not on 0.

Demo tracks are written in the similar fashion, but contains more information. Each track is an object that has numbers as properties which represent the nth note in the scale. (in C major scale, C is 0, D is 1, E is 2, etc...) The properties have a nested array much like beat patterns, with each digit representing 1/8 note. Demo tracks also have other necessary information as properties such as beat pattern and scale that.
