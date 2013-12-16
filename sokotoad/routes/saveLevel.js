var MongoClient = require("mongodb").MongoClient;
exports.saveLevel = function(req, res) {
MongoClient.connect("mongodb://localhost:27017/sokotoadDB", function(err, db) {
if(err) throw err;
        var level = req.body.level;
        var levelsCollection = db.collection("levels");
        levelsCollection.insert( {"levelData": level}, function(err, inserted) {
            if(err) throw err;
            console.log("Level successfuly inserted");
            res.render('levelSaved', {levelData: level});            
        });
    });
};
