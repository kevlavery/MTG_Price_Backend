var mongoose = require('mongoose');
var databaseConnection = require('../data/DatabaseConnection.json');

mongoose.connect(databaseConnection.url, function(err)***REMOVED***
    if (err) ***REMOVED***
        console.log("Error connecting to MongoDB");
        process.exit(1);
    ***REMOVED***
***REMOVED***);
mongoose.set('useCreateIndex', true);

var bulkUpload = require('./bulkUpload');

bulkUpload.getAndPopulateBulkData()
.then(() => ***REMOVED***
    mongoose.disconnect();
***REMOVED***);