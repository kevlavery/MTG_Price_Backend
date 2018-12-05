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

Card.find({cmc: 5} , (err, cards) => {
    if(err) {
        console.log(err);
    }
    CardTools.updateCardPrice(cards)
    .then(() => {
        mongoose.disconnect();
    });
});

// Card.find({scryfallId: "17ac2bff-f570-4955-a8d4-7e12d616dd8b"} , (err, card) => {
//     if(err) {
//         console.log(err);
//     }
//     CardTools.updateCardPrice(card[0])
// }).then(() => {
//     mongoose.disconnect();
// })