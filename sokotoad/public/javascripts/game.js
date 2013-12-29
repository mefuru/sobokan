
// Initialise variables
var canvas = document.createElement("canvas");
canvas.width = 800;
canvas.height = 800;
document.body.appendChild(canvas);
var context = canvas.getContext("2d"),
noRows = 10,
noColns = 10;

var currentWorldState = [];
var player = null; // initialised to null
var walls = []; // contains all instances of wall
var targets = []; // contains all instances of target
var crates = []; // contains all instances of crates
var floors = [];
var elementWidth = canvas.width/noRows;
var elementHeight = canvas.height/noColns;
var numMoves = 0;


var wallImage = new Image();
wallImage.onload = function() {
    drawBoard();
};
wallImage.src = "images/wall.png";

var floorImage = new Image();
floorImage.onload = function() {
    drawBoard();
};
floorImage.src = "images/floor.png";

var targetImage = new Image();
targetImage.onload = function() {
    drawBoard();
};
targetImage.src = "images/target.png";

var crateImage = new Image();
crateImage.onload = function() {
    drawBoard();
};
crateImage.src = "images/crate.png";

var playerImage = new Image();
playerImage.onload = function() {
    console.log(playerImage);
    drawBoard();
};
playerImage.src = "images/player.png";

var imageMap = {
    "floor": floorImage,
    "crate": crateImage,
    "player": playerImage,
    "wall": wallImage,
    "target": targetImage
};

var moveDirection = {
    "LEFT" : [-elementWidth, 0],
    "RIGHT" : [elementWidth, 0],
    "UP" : [0, -elementHeight],
    "DOWN" : [0, elementHeight]
};

// Tile constructor
var Tile = function(xPos, yPos, type) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = elementWidth;
    this.height = elementHeight;
    this.type = type;
};

// draw functions
Tile.prototype.draw = function() {
    console.log(imageMap);
    context.drawImage(imageMap[this.type], this.xPos, this.yPos, this.width, this.height);
};

// draw function
var drawBoard = function(){
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawElements(floors);
    drawElements(walls);
    drawElements(targets);
    drawElements(crates);
    player.draw();
};

// helper function to iterate over all elems on board and draw
var drawElements = function(arr){
    for (var i = 0; i < arr.length; i++) {
        arr[i].draw();
    }
};

// checks validity of move
var checkMove = function(dir, obj) {
    var prospectiveXpos = obj.xPos + dir[0]; // prospective positions are the coordinates of where the player would move to
    var prospectiveYpos = obj.yPos + dir[1];
    // iterate over all crates, walls and targets
    for (var i = 0; i < walls.length; i++) {
        if(walls[i].xPos == prospectiveXpos && walls[i].yPos == prospectiveYpos) {
            return false;
        }
    }
    for (var i = 0; i < crates.length; i++) {
        if(crates[i].xPos == prospectiveXpos && crates[i].yPos == prospectiveYpos) {
            if (obj.type == "crate") return false; // if current obj is crate, return false as cannot move
            if (checkMove(dir, crates[i])) {
                crates[i].xPos += dir[0];
                crates[i].yPos += dir[1];
                return true;
            } else return false;
        }
    }
    for (var i = 0; i < targets.length; i++) {
        if(targets[i].xPos == prospectiveXpos && targets[i].yPos == prospectiveYpos) {
            for (var i = 0; i < crates.length; i++) {
                if(crates[i].xPos == prospectiveXpos && crates[i].yPos == prospectiveYpos) {
                    return false;
                }
            }
            return true;
        }
    }
    return true;
};

var checkWin = function(){

    var matchCount = 0;
    for(var i = 0; i < targets.length; i++)
    {
        for(var j = 0; j < crates.length; j++)
        {
            if(targets[i].xPos == crates[j].xPos && targets[i].yPos == crates[j].yPos)
                matchCount++;
        }
    }

    if(matchCount == crates.length)
    {
        console.log("WIN");
        console.log("Number of moves " + numMoves);
    }

};

var movePlayer = function(dir){

    if(checkMove(dir, player))
    {
        player.xPos += dir[0];
        player.yPos += dir[1];
        drawBoard();
        numMoves++;
        checkWin();
    }
    
}
window.addEventListener("keydown", function (evt) {
    //up
    if (evt.keyCode==38) {
        movePlayer(moveDirection.UP);
    }
    //down
    if (evt.keyCode==40) {
        movePlayer(moveDirection.DOWN);
    }
    //left
    if (evt.keyCode==37) {
        movePlayer(moveDirection.LEFT);
    }
    //right
    if (evt.keyCode==39) {
        movePlayer(moveDirection.RIGHT);
    }
});

var initWorld = function() {
    var world =[ -1, -1, 1, 1, 1, 1, 1, -1, -1, -1,
                  1, 1, 1, 0, 0, 0, 1, -1, -1, -1,
                  1, 3, 0, 2, 0, 0, 1, -1, -1, -1,
                  1, 1, 1, 0, 2, 3, 1, -1, -1, -1,
                  1, 3, 1, 1, 2, 0, 1, -1, -1, -1,
                  1, 0, 1, 0, 3, 0, 1, 1, -1, -1,
                  1, 2, 0, 0, 0, 0, 3, 1, -1, -1,
                  1, 0, 0, 1, 2, 2, 0, 1, -1, -1,
                  1, 0, 0, 4, 3, 0, 0, 1, -1, -1,
                  1, 1, 1, 1, 1, 1, 1, 1, -1, -1
                ];
    // 1 == wall, 0 == nothing, 2 == crate, 3 == target, 4 == player
    world.forEach(function(elem, index, arr) {
        if(elem == 1) {
            walls.push(new Tile(index%10 * elementWidth, Math.floor(index/10) * elementHeight, 'wall'));
        }
        else if(elem == 2) {
            floors.push( new Tile(index%10 * elementWidth, Math.floor(index/10) * elementHeight, 'floor'));
            crates.push(new Tile(index%10 * elementWidth, Math.floor(index/10) * elementHeight, 'crate'));
        }
        else if(elem == 3) {
            floors.push( new Tile(index%10 * elementWidth, Math.floor(index/10) * elementHeight, 'floor'));
            targets.push(new Tile(index%10 * elementWidth, Math.floor(index/10) * elementHeight, 'target'));
        }
        else if(elem == 4) {
            floors.push(new Tile(index%10 * elementWidth, Math.floor(index/10) * elementHeight, 'floor'));
            player = new Tile(index%10 * elementWidth, Math.floor(index/10) * elementHeight, 'player');
        }
        else if(elem == 0) {
            floors.push( new Tile(index%10 * elementWidth, Math.floor(index/10) * elementHeight, 'floor'));
        }
    });
};

initWorld();
