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
mongoose.set('useNewUrlParser', true);


var attachCards = require('./attachCardsToSet');
Sets.find({}, function addCards(err, sets) {
    if(err) {
        console.log(err);
    }
    attachCards.populateAllSets(sets).then(() => {
        mongoose.disconnect();
    });
});