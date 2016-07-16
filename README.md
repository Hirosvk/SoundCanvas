# SoundCanvas
[Live Link][live_link]
[live_link]: http://soundcanvas.heroku.com

![screeshot1][scrrenshot1]
[scrrenshot1]:./screenshots/sound_canvas.jpg

## Overview
SoundCanvas turns music into abstract art animation. Make music with the simple interface (you need no musical experience!), and art will appear on the canvas. Click [here][live_link] to play.

## How to Play
### Play Demo
The best way to get to know SoundCanvas is to watch demo tracks first. Choose a demo track and click "Watch Demo." Click "Stop" to stop the animation and music.
### Create Music
Click 'Activate Canvas' and the back beat will begin. Play any notes by typing keys or by clicking the note buttons. Shapes will emerge on the canvas. Click "Stop" to stop the beat.
### Change Settings
You can change tempo, scales, and beat pattern. Your new settings will take effect after clicking "Activate Canvas."



## Technical
SoundCanvas was made purely by vanilla JavaSripts(ES6) and HTML5(Canvas). All audio effects are produced programmatically through AudioContext.

## How it Works
SoundCanvas creates animation from your music based on rules, and it does not rely on randomization. The intervals of the notes you play determine colors. New color tiles are generated on every beat.
