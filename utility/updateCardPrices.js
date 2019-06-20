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

Card.find(***REMOVED******REMOVED*** , (err, cards) => ***REMOVED***
    if(err) ***REMOVED***
        console.log(err);
    ***REMOVED***
    CardTools.updateCardPrice(cards)
    .then(() => ***REMOVED***
        mongoose.disconnect();
        var t1 = performance.now();
    ***REMOVED***);
***REMOVED***);