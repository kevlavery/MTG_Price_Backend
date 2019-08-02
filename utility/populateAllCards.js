var mongoose = require('mongoose');
var databaseConnection = require('../data/DatabaseConnection.json');
var Sets = require('../models/sets');

mongoose.connect(databaseConnection.url, function(err){
    if (err) {
        console.log("Error connecting to MongoDB");
        process.exit(1);
    }
});
mongoose.set('useCreateIndex', true);
//still shows error
//mongoose.set('useNewUrlParser', true);

var addCardData = require('./addCardData');
addCardData.addCardsToSets()
.then(() => {
    mongoose.disconnect();
});