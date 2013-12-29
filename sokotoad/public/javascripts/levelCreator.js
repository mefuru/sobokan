// Initialise variables
var canvas = document.createElement("canvas");
canvas.width = 500;
canvas.height = 500;
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
wallImage.src = "images/wall.png";

var floorImage = new Image();
floorImage.onload = function() {
    drawBoard();
    drawSelectorTiles();
};
floorImage.src = "images/floor.png";

var targetImage = new Image();
targetImage.onload = function() {
    drawBoard();
    drawSelectorTiles();
};
targetImage.src = "images/target.png";

var crateImage = new Image();
crateImage.onload = function() {
    drawBoard();
    drawSelectorTiles();
};
crateImage.src = "images/crate.png";

var playerImage = new Image();
playerImage.onload = function() {
    drawBoard();
    drawSelectorTiles();
};
playerImage.src = "images/player.png";

var imageMap = {
    "floor": floorImage,
    "crate": crateImage,
    "player": playerImage,
    "wall": wallImage,
    "target": targetImage
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

var sendLevelToServer = function(path, value){
	method = "post";
	var form = document.createElement("form");
	form.setAttribute("method", method);
	form.setAttribute("action", path);
	var hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "level");
	hiddenField.setAttribute("value", value);
	form.appendChild(hiddenField);

	document.body.appendChild(form);
	form.submit();
}

// create and save level arraym);
var saveLevel = function() {
    sendLevelToServer("/createLevel", JSON.stringify(mapElements.map(enumerateType)));
};

// helper fn for saveLevel
var enumerateType = function(elem) {
    if(elem.type == 'floor') return 0;
    if(elem.type == 'wall') return 1;
    if(elem.type == 'crate') return 2;
    if(elem.type == 'target') return 3;
    if(elem.type == 'player') return 4;
};

// Level creator
var drawSelectorTiles = function(){
    editorTiles.forEach(function(elem) {
        elem.draw(context2);
    });
};

// hooks up a button to save level fn
var initSaveButton = function() {
    var saveButton = document.getElementById("saveButton");
    saveButton.addEventListener("click", function(event) {
        saveLevel();
    }, false);
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
initSaveButton();
