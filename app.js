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

var moveDirection = {
    "LEFT" : -1,
    "RIGHT" : 1,
    "UP" : -10,
    "DOWN" : 10
};

// Player constructor
var Player = function(xPos, yPos, boardIndex) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = canvas.width/noRows;
    this.height = canvas.height/noColns;
    this.colour = "rgb(0,0,0)";
    this.boardIndex = boardIndex;
};

// Wall constructor
var Wall = function(xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = canvas.width/noRows;
    this.height = canvas.height/noColns;
    this.colour = "rgb(10,10,10)";
};

// Crate constructor
var Crate = function(xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = canvas.width/noRows;
    this.height = canvas.height/noColns;
    this.colour = "rgb(170,150,30)";
};

// Target constructor
var Target = function(xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = canvas.width/noRows;
    this.height = canvas.height/noColns;
    this.colour = "rgb(200,200,200)";
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

// move function - changes player position and draws all elems. Deprecated
Player.prototype.move = function(moveDir)
{
    player.boardIndex += moveDir;
    currentWorldState.forEach(function(elem, index, arr) {
        if(elem == 1) {
            var wall = new Wall(index%10 * (canvas.width/noColns), (Math.floor(index/10) * (canvas.height/noRows)));
            wall.draw(); 
        }
        else if(elem == 2) {
            var crate = new Crate(index%10 * (canvas.width/noColns), (Math.floor(index/10) * (canvas.height/noRows)));
            crate.draw(); 
        }
        else if(elem == 3) {
            var target = new Target(index%10 * (canvas.width/noColns), (Math.floor(index/10) * (canvas.height/noRows)));
            target.draw(); 
        }
        else if(elem == 4) {
            player = new Player(index%10 * (canvas.width/noColns), (Math.floor(index/10) * (canvas.height/noRows)), index);
            console.log("Board index of player: " + player.boardIndex);
            player.draw(); 
        }

    });
}

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

// checks validity of crate move
var checkMove2 = function(dir, obj) {
    var prospectiveXpos = obj.xPos + dir[0];
    var prospectiveYpos = obj.yPos + dir[1];
    // iterate over all crates, walls and targets
    walls.forEach(function(elem, index, arr) {
        if (elem.xPos == prospectiveXpos && elem.yPos == prospectiveYpos) {return false};
    });    
    targets.forEach(function(elem, index, arr) {
        if (elem.xPos == prospectiveXpos && elem.yPos == prospectiveYpos) {
            return true;
        }
    });
    
    crates.forEach(function(elem, index, arr) {
        if (elem.xPos == prospectiveXpos && elem.yPos == prospectiveYpos) {return false};
    });
    return true;
};

// checks validity of move
var checkMove = function(dir, obj) {
    var prospectiveXpos = obj.xPos + dir[0]; // prospective positions are the coordinates of where the player would move to
    var prospectiveYpos = obj.yPos + dir[1];
    // iterate over all crates, walls and targets
    targets.forEach(function(elem, index, arr) {
        if (elem.xPos == prospectiveXpos && elem.yPos == prospectiveYpos) {
            console.log('hit target');
            return true;
        }
    });
    walls.forEach(function(elem, index, arr) {
        if (elem.xPos == prospectiveXpos && elem.yPos == prospectiveYpos) {
            console.log('hit wall');
            return false;
        }
    });
    crates.forEach(function(elem, index, arr) {
        if (elem.xPos == prospectiveXpos && elem.yPos == prospectiveYpos) {
            // move player and crate IF there is no elem or there is a target after the crate
            if(checkMove2(dir, elem)) {
                elem.xPos += dir[0];
                elem.yPos += dir[1];
                return true;
            } else return false;
        }
    });
    console.log('hey');
    return true;
};

window.addEventListener("keydown", function (evt) {
    //up
    if (evt.keyCode==38) {
        var dir = [0, -player.height]
        if(checkMove(dir, player)) {
            player.xPos += dir[0];
            player.yPos += dir[1];
            drawBoard();
        }
    }
    // //down
    // if (evt.keyCode==40 && currentWorldState[player.boardIndex + moveDirection.DOWN] === 0) {
    //     currentWorldState[player.boardIndex + moveDirection.DOWN] = 4;
    //     currentWorldState[player.boardIndex] = 0;

    //     context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    //     player.move(moveDirection.DOWN);
    // }
    // //left
    // if (evt.keyCode==37 && currentWorldState[player.boardIndex + moveDirection.LEFT] === 0) {
    //     currentWorldState[player.boardIndex + moveDirection.LEFT] = 4;
    //     currentWorldState[player.boardIndex] = 0;

    //     context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    //     player.move(moveDirection.LEFT);
    // }
    // //right
    // if (evt.keyCode==39 && currentWorldState[player.boardIndex + moveDirection.RIGHT] === 0) {
    //     currentWorldState[player.boardIndex + moveDirection.RIGHT] = 4;
    //     currentWorldState[player.boardIndex] = 0;

    //     context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    //     player.move(moveDirection.RIGHT);
    // }
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
                  1, 0, 0, 4, 3, 0, 2, 1, 0, 0,
                  1, 1, 1, 1, 1, 1, 1, 1, 0, 0
                ];
    currentWorldState = world.slice();
    // 1 == wall, 0 == nothing, 2 == crate, 3 == target, 4 == player
    world.forEach(function(elem, index, arr) {
        if(elem == 1) {
            walls.push(new Wall(index%10 * (canvas.width/noColns), (Math.floor(index/10) * (canvas.height/noRows))));
        }
        else if(elem == 2) {
            crates.push(new Crate(index%10 * (canvas.width/noColns), (Math.floor(index/10) * (canvas.height/noRows))));
        }
        else if(elem == 3) {
            targets.push(new Target(index%10 * (canvas.width/noColns), (Math.floor(index/10) * (canvas.height/noRows))));
        }
        else if(elem == 4) {
            player = new Player(index%10 * (canvas.width/noColns), (Math.floor(index/10) * (canvas.height/noRows)), index);
        }
        
    });
};

var animate = function() {
    drawBoard();
};

initWorld();
animate();
