
var ImageManager = function(){
	//Holds all your loaded images
	this.library = {};
	//used to check if loading is still in progress
	this.finished = true;
}

ImageManager.prototype.load = function(path, name){

    //Setting up a variable that will store setInterval function so we can clear after loading is finished
    //var intervalId;

    var alreadyLoaded = function(){
    	if(this.library[name]){
    		console.log("Image with name: " + name + " already exists.");
    		return true;
    	}
    	else{
    		return false;
    	}
    }.bind(this);

    var loadImage = function(thisArg, callback){    
        if(!alreadyLoaded()){
        	var img = new Image();
        	thisArg.finished = false;
        	img.onload = function() {
        	    console.log("Loaded image named " + name);
        	    callback(thisArg, img);
        	};
        	img.src = path;
        }
        
    };

    loadImage(this, function(thisArg, img){
        thisArg.library[name] = img;
        thisArg.finished = true;
        console.log("Inserted loaded image into library.");
    });
    
   /* var waitForImagesToLoad = function(){
        if(this.library[name] == undefined){
        	this.isLoading = true;
            console.log("Loading image...");
        }
        else{
        	this.isLoading = false;
            clearInterval(intervalId);
            console.log("Finised loading image"); 
		}
    };

    var boundWait = waitForImagesToLoad.bind(this);
    intervalId = setInterval(boundWait, 500);*/
};

ImageManager.prototype.isFinishedLoading = function(){
	return this.finished;
}

ImageManager.prototype.getImage = function(name){
	if(this.library[name]){
		return this.library[name];
	}
	else{
		console.log("The image of name: " + name + " doesn't exist yet.");
		return null;
	}
};
