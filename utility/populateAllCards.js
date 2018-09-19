var mongoose = require('mongoose');
var databaseConnection = require('../data/DatabaseConnection.json');
var Sets = require('../models/sets');

mongoose.connect(databaseConnection.url, function(err)***REMOVED***
  if (err) ***REMOVED***
    console.log("Error connecting to MongoDB");
    process.exit(1);
  ***REMOVED***
***REMOVED***);
mongoose.set('useCreateIndex', true);
//still shows error
mongoose.set('useNewUrlParser', true);


var attachCards = require('./attachCardsToSet');
Sets.find(***REMOVED******REMOVED***, function addCards(err, sets) ***REMOVED***
    if(err) ***REMOVED***
        console.log(err);
    ***REMOVED***
    attachCards.populateAllSets(sets).then(() => ***REMOVED***
        mongoose.disconnect();
    ***REMOVED***);
***REMOVED***);