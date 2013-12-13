// Initialise variables
var canvas = document.createElement("canvas");
canvas.width = 800;
canvas.height = 800;
document.body.appendChild(canvas);
var context = canvas.getContext("2d"),
noRows = 10,
noColns = 10;
var canvas2 = document.createElement("canvas");
canvas2.setAttribute("id", "canvas2");
canvas2.width = 300;
canvas2.height = 800;
document.body.appendChild(canvas2);
var context2 = canvas2.getContext("2d");
var editorTiles = [];
var selectedEditorTile = '';
// Game screen
var world = [];
var player = null; // initialised to null
var walls = []; // contains all instances of wall
var targets = []; // contains all instances of target
var crates = []; // contains all instances of crates
var floors = [];
var mapElements = [];
var elementWidth = canvas.width/noRows;
var elementHeight = canvas.height/noColns;
var numMoves = 0;
var playerIndex = -1;

var wallImage = new Image();
wallImage.onload = function() {
    drawBoard();
    drawSelectorTiles();
};
wallImage.src = "wall.png";

var floorImage = new Image();
floorImage.onload = function() {
    drawBoard();
    drawSelectorTiles();
};
floorImage.src = "floor.png";

var targetImage = new Image();
targetImage.onload = function() {
    drawBoard();
    drawSelectorTiles();
};
targetImage.src = "target.png";

var crateImage = new Image();
crateImage.onload = function() {
    drawBoard();
    drawSelectorTiles();
};
crateImage.src = "crate.png";

var playerImage = new Image();
playerImage.onload = function() {
    drawBoard();
    drawSelectorTiles();
};
playerImage.src = "player.png";

var imageMap = {
    "floor": floorImage,
    "crate": crateImage,
    "player": playerImage,
    "wall": wallImage,
    "target": targetImage
};

// Tile constructor
var Tile = function(xPos, yPos, type, mutable) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = elementWidth;
    this.height = elementHeight;
    this.type = type;
    if(mutable!==false){
        this.mutable = true;
    } else {
        this.mutable = mutable;
    }
};

// draw functions
Tile.prototype.draw = function(context) {
    context.drawImage(imageMap[this.type], this.xPos, this.yPos, this.width, this.height);
};

// draw function
var drawBoard = function(){
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawElements(mapElements);
    drawElements(floors);
    drawElements(walls);
    drawElements(targets);
    drawElements(crates);
    // player.draw();
};

// helper function to iterate over all elems on board and draw
var drawElements = function(arr){
    for (var i = 0; i < arr.length; i++) {
        arr[i].draw(context);
    }
};

var initWorld = function() {
    world = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
              1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
              1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
              1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
              1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
              1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
              1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
              1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
              1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
              1, 1, 1, 1, 1, 1, 1, 1, 1, 1
            ];
    // 1 == wall, 0 == nothing, 2 == crate, 3 == target, 4 == player
    world.forEach(function(elem, index, arr) {
        if(elem==0){
        mapElements.push( new Tile(index%10 * elementWidth, Math.floor(index/10) * elementHeight, 'floor'));
        } else {
            mapElements.push( new Tile(index%10 * elementWidth, Math.floor(index/10) * elementHeight, 'wall', false));
        }
    });
};

// Level creator
var drawSelectorTiles = function(){
    editorTiles.forEach(function(elem) {
        elem.draw(context2);
    });
};

var initMapEditor = function() {
    // 1 == wall, 0 == nothing, 2 == crate, 3 == target, 4 == player
    editorTiles.push(new Tile(10, 100, 'floor'));
    editorTiles.push(new Tile(10, 200, 'wall'));
    editorTiles.push(new Tile(10, 300, 'player'));
    editorTiles.push(new Tile(10, 400, 'crate'));
    editorTiles.push(new Tile(10, 500, 'target'));
    selectedEditorTile = 'player';
};

canvas.addEventListener('click', function(event) {
    console.log(selectedEditorTile);
    console.log('canvas 1 clicked on');
    var x = event.pageX,
        y = event.pageY;
    mapElements.forEach(function(elem, index) {
        if(y > elem.yPos && y < elem.yPos + elementHeight && x > elem.xPos && x < elem.xPos + elementWidth && elem.mutable === true) {
            if(selectedEditorTile === 'player') {
                if(playerIndex === -1) {
                    playerIndex = index;
                    elem.type = selectedEditorTile;
                    drawBoard();
                } else {
                    mapElements[playerIndex].type = 'floor';
                    playerIndex = index;
                    elem.type = selectedEditorTile;
                    drawBoard();
                }
            } else {
                elem.type = selectedEditorTile;
                drawBoard();
            }
        }
    });
}, false);

// Add event listener for 'click' events
canvas2.addEventListener('click', function(event) {
    console.log('canvas 2 clicked on');
    var x = event.pageX - canvas.width,
        y = event.pageY;
    editorTiles.forEach(function(elem2) {
        if(y > elem2.yPos && y < elem2.yPos + elementHeight && x > elem2.xPos && x < elem2.xPos + elementWidth) {
            selectedEditorTile = elem2.type;
            console.log(selectedEditorTile);
        }
    });

}, false);

initWorld();
initMapEditor();
