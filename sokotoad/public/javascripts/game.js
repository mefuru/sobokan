//TODO:

//add jQuery to use ajax to request files from the server, OR mongodb soon

//Fix the ambiguity between the levelCreator.js and game.js.. now
//game.js draws the board even in edit mode, while levelCreator keeps a reference to the game.mapElements
//Maybe not the best solution...

var Game = function(){

   this.numRows = 10;
   this.numCols = 10;

   this.player = null; // initialised to null
   this.walls = []; // contains all instances of wall
   this.targets = []; // contains all instances of target
   this.crates = []; // contains all instances of crates
   this.floors = [];
   this.numMoves = 0;


//   this.world = [];
};

Game.prototype.initVariables = function(){

    this.elementWidth = this.canvas.width/this.numRows; //superfluous since the board will be composed of sqares?
    this.elementHeight = this.canvas.height/this.numCols;
    this.elementSize = this.canvas.width/this.numRows;

    this.moveDirection = {
        "LEFT" : [-this.elementWidth, 0],
        "RIGHT" : [this.elementWidth, 0],
        "UP" : [0, -this.elementHeight],
        "DOWN" : [0, this.elementHeight]
    };

};

Game.prototype.play = function(){
    //if path not set, load default level
    this.setupImages(); //Begin loading images first
    this.setupMainRenderContext();
    this.initVariables();
    this.setupGameEventlistener(this);
    //this.loadLevel();
    //this.drawBoard();

};

//combine these two
Game.prototype.setupMainRenderContext = function(){

	this.canvas = document.createElement("canvas");
	this.canvas.width = 800;
	this.canvas.height = 800;
	document.body.appendChild(this.canvas);

	this.context = this.canvas.getContext("2d");
};

Game.prototype.setupImages = function(){

    //Setting up a variable that will store setInterval function so we can clear after loading is finished
    var intervalId;
    var count = 0;
    //Returns the image when finished loading
    var loadAsset = function(path, thisArg, callback){    
        var img = new Image();
        img.onload = function() {
            console.log("Loaded image with path " + path);
            callback(thisArg, img);
        };
        img.src = path;
    };

    loadAsset("images/wall.png", this, function(thisArg, img){
        thisArg.wallImage = img;
    });
    loadAsset("images/floor.png", this, function(thisArg, img){
        thisArg.floorImage = img;
    });
    loadAsset("images/target.png", this, function(thisArg, img){
        thisArg.targetImage = img;
    });
    loadAsset("images/crate.png", this, function(thisArg, img){
        thisArg.crateImage = img;
    });
    loadAsset("images/player.png", this, function(thisArg, img){
        thisArg.playerImage = img;
    });

    var waitForImagesToLoad = function(){
        if(this.wallImage == undefined || this.floorImage == undefined
            || this.targetImage == undefined || this.crateImage == undefined
            || this.playerImage == undefined){
            console.log("Loading images...");
        }
        else{
            this.imageMap = {
                "floor": this.floorImage,
                "crate": this.crateImage,
                "player": this.playerImage,
                "wall": this.wallImage,
                "target": this.targetImage
            };
            clearInterval(intervalId);
            console.log("Finised loading images"); 

            this.loadLevel(); 
            this.drawBoard();      
        }
    };

    var boundWait = waitForImagesToLoad.bind(this);
    intervalId = setInterval(boundWait, 500);

};

//Draws the board
Game.prototype.drawBoard = function(){

    // helper function to iterate over all elems on board and draw
    var drawElements = function(arr, context){
        for (var i = 0; i < arr.length; i++) {
            arr[i].draw(context);
        }
    };

    //Starts by clearing canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    drawElements(this.floors, this.context);
    drawElements(this.walls, this.context);
    drawElements(this.targets, this.context);
    drawElements(this.crates, this.context);
    this.player.draw(this.context);

};

// checks validity of move
Game.prototype.checkMove = function(dir, obj) {
    var prospectiveXpos = obj.xPos + dir[0]; // prospective positions are the coordinates of where the player would move to
    var prospectiveYpos = obj.yPos + dir[1];
    // iterate over all crates, walls and targets
    for (var i = 0; i < this.walls.length; i++) {
        if(this.walls[i].xPos == prospectiveXpos && this.walls[i].yPos == prospectiveYpos) {
            return false;
        }
    }
    for (var i = 0; i < this.crates.length; i++) {
        if(this.crates[i].xPos == prospectiveXpos && this.crates[i].yPos == prospectiveYpos) {
            if (obj.type == "crate") return false; // if current obj is crate, return false as cannot move
            if (this.checkMove(dir, this.crates[i])) {
                this.crates[i].xPos += dir[0];
                this.crates[i].yPos += dir[1];
                return true;
            } else return false;
        }
    }
    for (var i = 0; i < this.targets.length; i++) {
        if(this.targets[i].xPos == prospectiveXpos && this.targets[i].yPos == prospectiveYpos) {
            for (var i = 0; i < this.crates.length; i++) {
                if(this.crates[i].xPos == prospectiveXpos && this.crates[i].yPos == prospectiveYpos) {
                    return false;
                }
            }
            return true;
        }
    }
    return true;
};

Game.prototype.checkWin = function(){
    var matchCount = 0;
    for(var i = 0; i < this.targets.length; i++){
        for(var j = 0; j < this.crates.length; j++){
            if(this.targets[i].xPos == this.crates[j].xPos && this.targets[i].yPos == this.crates[j].yPos)
                matchCount++;
        }
    }

    if(matchCount == this.crates.length){
        console.log("WIN");
        console.log("Number of moves " + this.numMoves);
    }

};

Game.prototype.movePlayer = function(dir){
    if(this.checkMove(dir, this.player)){
        this.player.xPos += dir[0];
        this.player.yPos += dir[1];
        this.drawBoard();
        this.numMoves++;
        this.checkWin();
    }
    
};

Game.prototype.setupGameEventlistener = function(gameref){


    window.addEventListener("keydown", function (evt) {
        //up
        if (evt.keyCode==38) {
            gameref.movePlayer(gameref.moveDirection.UP);
        }
        //down
        if (evt.keyCode==40) {
            gameref.movePlayer(gameref.moveDirection.DOWN);
        }
        //left
        if (evt.keyCode==37) {
            gameref.movePlayer(gameref.moveDirection.LEFT);
        }
        //right
        if (evt.keyCode==39) {
            gameref.movePlayer(gameref.moveDirection.RIGHT);
        }
    });
};


//Loads either default level from file or from post request, or empty lvl also from file (for editor)
Game.prototype.loadLevel = function(levelData){
    console.log("this of loadLevel fn: " + this);
    var world = [];

    if(levelData)
        world = levelData;
    else{
        world = [ -1, -1, 1, 1, 1, 1, 1, -1, -1, -1,
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
    }

    for(var i = 0; i < world.length; i++){
        (function(i){
            if(world[i] == 1) {
                this.walls.push(new Tile(this.imageMap, i%10 * this.elementWidth, Math.floor(i/10) * this.elementHeight, this.elementSize, 'wall'));
            }
            else if(world[i] == 2) {
                this.floors.push(new Tile(this.imageMap, i%10 * this.elementWidth, Math.floor(i/10) * this.elementHeight, this.elementSize, 'floor'));
                this.crates.push(new Tile(this.imageMap, i%10 * this.elementWidth, Math.floor(i/10) * this.elementHeight, this.elementSize, 'crate'));
            }
            else if(world[i] == 3) {
                this.floors.push( new Tile(this.imageMap, i%10 * this.elementWidth, Math.floor(i/10) * this.elementHeight, this.elementSize, 'floor'));
                this.targets.push(new Tile(this.imageMap, i%10 * this.elementWidth, Math.floor(i/10) * this.elementHeight, this.elementSize, 'target'));
            }
            else if(world[i] == 4) {
                this.floors.push(new Tile(this.imageMap, i%10 * this.elementWidth, Math.floor(i/10) * this.elementHeight, this.elementSize, 'floor'));
                this.player = new Tile(this.imageMap, i%10 * this.elementWidth, Math.floor(i/10) * this.elementHeight, this.elementSize, 'player');
            }
            else if(world[i] == 0) {
                this.floors.push( new Tile(this.imageMap, i%10 * this.elementWidth, Math.floor(i/10) * this.elementHeight, this.elementSize, 'floor'));
            }                
        }).call(this, i);
    }
 
    // 1 == wall, 0 == nothing, 2 == crate, 3 == target, 4 == player
    /*this.world.forEach(function(elem, index, arr) {
        if(elem == 1) {
            this.walls.push(new Tile(index%10 * this.elementWidth, Math.floor(index/10) * this.elementHeight, this.elementSize, 'wall'));
        }
        else if(elem == 2) {
            this.floors.push(new Tile(index%10 * this.elementWidth, Math.floor(index/10) * this.elementHeight, this.elementSize, 'floor'));
            this.crates.push(new Tile(index%10 * this.elementWidth, Math.floor(index/10) * this.elementHeight, this.elementSize, 'crate'));
        }
        else if(elem == 3) {
            this.floors.push( new Tile(index%10 * this.elementWidth, Math.floor(index/10) * this.elementHeight, this.elementSize, 'floor'));
            this.targets.push(new Tile(index%10 * this.elementWidth, Math.floor(index/10) * this.elementHeight, this.elementSize, 'target'));
        }
        else if(elem == 4) {
            this.floors.push(new Tile(index%10 * this.elementWidth, Math.floor(index/10) * this.elementHeight, this.elementSize, 'floor'));
            this.player = new Tile(index%10 * this.elementWidth, Math.floor(index/10) * this.elementHeight, this.elementSize, 'player');
        }
        else if(elem == 0) {
            this.floors.push( new Tile(index%10 * this.elementWidth, Math.floor(index/10) * this.elementHeight, this.elementSize, 'floor'));
        }
    });*/
};

var game = new Game();
game.play();  ///send in level to load 
//game.edit(); //loads an empty board and initializes the editor script with new Editor(game);


/*
// Initialise variables
var canvas = document.createElement("canvas");
canvas.width = 500;
canvas.height = 500;
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

// draw function
var drawBoard = function(){
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawElements(floors);
    drawElements(walls);
    drawElements(targets);
    drawElements(crates);
    player.draw(context);
};

// helper function to iterate over all elems on board and draw
var drawElements = function(arr){
    for (var i = 0; i < arr.length; i++) {
        arr[i].draw(context);
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
    var world;
    if (levelData!=undefined) {
        world = levelData;
    } else {world = [ -1, -1, 1, 1, 1, 1, 1, -1, -1, -1,
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
           }
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
*/