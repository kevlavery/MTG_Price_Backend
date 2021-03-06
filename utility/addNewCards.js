const mongoose = require('mongoose');
const databaseConnection = process.env.MONGODB_URI || require('../data/DatabaseConnection.json');
const { performance } = require('perf_hooks');

mongoose.connect(databaseConnection.url, function(err){
    if (err) {
        console.log("Error connecting to MongoDB");
        process.exit(1);
    }
});
mongoose.set('useCreateIndex', true);

var t0 = performance.now();
console.log(`Starting to add new released cards at ${Date(Date.now())}`);
const bulkUpload = require('./addCardData');
bulkUpload.addNewCards()
.then(() => {
    var t1 = performance.now();	
    console.log(`It took ${((t1-t0)/1000).toFixed(2)} seconds to add new cards`);	
    const used = process.memoryUsage().heapUsed / 1024 / 1024;	
    console.log(`The script uses approximately ${used} MB`);
    mongoose.disconnect();
});