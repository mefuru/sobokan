// Tile constructor
var Tile = function(xPos, yPos, size, type, mutable) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.size = size;
    this.type = type;

    if(mutable!==false){
        this.mutable = true;
    } else {
        this.mutable = mutable;
    }
};

// draw functions
Tile.prototype.draw = function(context) {
    context.drawImage(imageMgr.getImage(this.type), this.xPos, this.yPos, this.size, this.size);
};
