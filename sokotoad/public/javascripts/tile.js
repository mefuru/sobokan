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
