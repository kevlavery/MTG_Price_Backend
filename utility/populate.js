var mongoose = require('mongoose');
var databaseConnection = require('../data/DatabaseConnection.json');

mongoose.connect(databaseConnection.url, function(err){
  if (err) {
    console.log("Error connecting to MongoDB");
    process.exit(1);
  }
});

//Populate sets collection and close DB when done
var populateSets = require('./populateSets');
populateSets.getSets()
.then(sets => populateSets.populateSets(sets)
.then(() => mongoose.disconnect()));