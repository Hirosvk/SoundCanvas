## Structure
 the app is divided into two main components; 'Canvas' and 'MusicTracker'. Canvas takes care of the render logic of the triangular grid. 'MusicTracker' takes care of the playing and capturing of the notes being played.

###Canvas
Canvas lays out triangular grid system on initialization of the Canvas object based on the <canvas> dimensions set on the main html file.

####Rendering
In each grid block lives Triangle object, which holds one or more ColorTile objects. The ColorTile object keeps its color and moving direction.

On each render, the Triangle object generates the new color based on the all ColorTiles it holds. After every render, the ColorTiles are emitted to the adjacent Triangles according to its moving direction. As they leave their current Triangle, they are given the color of the Triangle. Since all Triangle contains white Tile as default, ColorTile's color fades gradually. When it's color turns white, the ColorTile object will be discarded.

On the initial design, the canvas was clearRect'ed on every render. However, on the current implementation, clearRect is not called, and color on the grid is not updated until next color comes in. (I just thought that the canvas looks better this way.)

## Challenges

* rendering triangle grid

* music
It was difficult to organize the classes
