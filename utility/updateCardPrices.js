var mongoose = require('mongoose');
var databaseConnection = require('../data/DatabaseConnection.json');
var Card = require('../models/card');
var CardTools = require('./populateCard');

mongoose.connect(databaseConnection.url, function(err)***REMOVED***
    if (err) ***REMOVED***
      console.log("Error connecting to MongoDB");
      process.exit(1);
    ***REMOVED***
  ***REMOVED***);
mongoose.set('useCreateIndex', true);

Card.find(***REMOVED***cmc: 5***REMOVED*** , (err, cards) => ***REMOVED***
    if(err) ***REMOVED***
        console.log(err);
    ***REMOVED***
    CardTools.updateCardPrice(cards)
    .then(() => ***REMOVED***
        mongoose.disconnect();
    ***REMOVED***);
***REMOVED***);

// Card.find(***REMOVED***scryfallId: "17ac2bff-f570-4955-a8d4-7e12d616dd8b"***REMOVED*** , (err, card) => ***REMOVED***
//     if(err) ***REMOVED***
//         console.log(err);
//     ***REMOVED***
//     CardTools.updateCardPrice(card[0])
// ***REMOVED***).then(() => ***REMOVED***
//     mongoose.disconnect();
// ***REMOVED***)