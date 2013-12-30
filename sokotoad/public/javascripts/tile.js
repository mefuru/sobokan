// Tile constructor
var Tile = function(imageMap, xPos, yPos, size, type, mutable) {
    this.xPos = xPos;
    this.yPos = yPos;
    /*this.width = elementWidth;
    this.height = elementHeight;*/
    this.size = size;
    this.type = type;
    console.log(imageMap);
    this.imageMap = imageMap;
    if(mutable!==false){
        this.mutable = true;
    } else {
        this.mutable = mutable;
    }
};

// draw functions
Tile.prototype.draw = function(context) {
	//console.log(this.imageMap[this.type]);
    context.drawImage(this.imageMap[this.type], this.xPos, this.yPos, this.size, this.size);
};
