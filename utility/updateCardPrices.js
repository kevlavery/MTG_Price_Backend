var mongoose = require('mongoose');
var databaseConnection = require('../data/DatabaseConnection.json');
var Card = require('../models/card');
var CardTools = require('./populateCard');

mongoose.connect(databaseConnection.url, function(err){
    if (err) {
      console.log("Error connecting to MongoDB");
      process.exit(1);
    }
  });
mongoose.set('useCreateIndex', true);

Card.find({} , (err, cards) => {
    if(err) {
        console.log(err);
    }
    CardTools.updateCardPrice(cards)
    .then(() => {
        mongoose.disconnect();
        var t1 = performance.now();
    });
});