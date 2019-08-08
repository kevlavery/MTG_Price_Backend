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

var t0 = performance.now();
CardTools.updateCardPriceStream()
.then(() => ***REMOVED***
    var t1 = performance.now();	
    console.log(`It took $***REMOVED***((t1-t0)/1000).toFixed(2)***REMOVED*** seconds to update card prices`);	
    const used = process.memoryUsage().heapUsed / 1024 / 1024;	
    console.log(`The script uses approximately $***REMOVED***used***REMOVED*** MB`);
    mongoose.disconnect();
***REMOVED***);

