var mongoose = require('mongoose');
var databaseConnection = require('../data/DatabaseConnection.json');

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
attachCards.getAndPopulateSet("https://api.scryfall.com/cards/search?order=set&q=e%3Abbd&unique=prints", "Battlebond")
.then(() => mongoose.disconnect());

