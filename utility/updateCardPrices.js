const mongoose = require('mongoose');
const databaseConnection = require('../data/DatabaseConnection.json');
const CardTools = require('./populateCard');

mongoose.connect(databaseConnection.url, function(err)***REMOVED***
    if (err) ***REMOVED***
    console.log("Error connecting to MongoDB");
    process.exit(1);
    ***REMOVED***
***REMOVED***);
mongoose.set('useCreateIndex', true);

CardTools.updateCardPriceStream()
.then(() => ***REMOVED***
    mongoose.disconnect();
***REMOVED***);

