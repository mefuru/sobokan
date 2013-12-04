window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60); // 60 fps
        };
})();

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
var elementWidth = canvas.width/noRows;
var elementHeight = canvas.height/noColns;
var numMoves = 0;

var moveDirection = {
    "LEFT" : [-elementWidth, 0],
    "RIGHT" :  [elementWidth, 0],
    "UP" : [0, -elementHeight],
    "DOWN" : [0, elementHeight]
};

// Player constructor
var Player = function(xPos, yPos, boardIndex) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = elementWidth;
    this.height = elementHeight;
    this.colour = "rgb(0,0,0)";
    this.boardIndex = boardIndex;
    this.type = "player";
};

// Wall constructor
var Wall = function(xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = elementWidth;
    this.height = elementHeight;
    this.colour = "rgb(10,10,10)";
    this.type = "wall";
};

// Crate constructor
var Crate = function(xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = elementWidth;
    this.height = elementHeight;
    this.colour = "rgb(170,150,30)";
    this.type = "crate";
};

// Target constructor
var Target = function(xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = elementWidth;
    this.height = elementHeight;
    this.colour = "rgb(200,200,200)";
    this.type = "target";
};

// draw functions
Player.prototype.draw = function() {
    context.fillStyle = this.colour;
    context.fillRect(this.xPos, this.yPos, this.width, this.height);
};

Wall.prototype.draw = function() {
    context.fillStyle = this.colour;
    context.fillRect(this.xPos, this.yPos, this.width, this.height);
};

Crate.prototype.draw = function() {
    context.fillStyle = this.colour;
    context.fillRect(this.xPos, this.yPos, this.width, this.height);
};

Target.prototype.draw = function() {
    context.fillStyle = this.colour;
    context.fillRect(this.xPos, this.yPos, this.width, this.height);
};

// draw function
var drawBoard = function(){
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawElements(walls);
    drawElements(targets);
    drawElements(crates);
    player.draw();
};

// helper function to iterate over all elems on board and draw
var drawElements = function(arr){
    arr.forEach(function(elem, index, array){
        elem.draw();
    });
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
    var world = [ 0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
                  1, 1, 1, 0, 0, 0, 1, 0, 0, 0,
                  1, 3, 0, 2, 0, 0, 1, 0, 0, 0,
                  1, 1, 1, 0, 2, 3, 1, 0, 0, 0,
                  1, 3, 1, 1, 2, 0, 1, 0, 0, 0,
                  1, 0, 1, 0, 3, 0, 1, 1, 0, 0,
                  1, 2, 0, 0, 0, 0, 3, 1, 0, 0,
                  1, 0, 0, 1, 2, 2, 0, 1, 0, 0,
                  1, 0, 0, 4, 3, 0, 0, 1, 0, 0,
                  1, 1, 1, 1, 1, 1, 1, 1, 0, 0
                ];
    // 1 == wall, 0 == nothing, 2 == crate, 3 == target, 4 == player
    world.forEach(function(elem, index, arr) {
        if(elem == 1) {
            walls.push(new Wall(index%10 * elementWidth, Math.floor(index/10) * elementHeight));
        }
        else if(elem == 2) {
            crates.push(new Crate(index%10 * elementWidth, Math.floor(index/10) * elementHeight));
        }
        else if(elem == 3) {
            targets.push(new Target(index%10 * elementWidth, Math.floor(index/10) * elementHeight));
        }
        else if(elem == 4) {
            player = new Player(index%10 * elementWidth, Math.floor(index/10) * elementHeight);
        }
        
    });
};

var animate = function() {
    drawBoard();
};

initWorld();
animate();
