var mongoose = require('mongoose');
var databaseConnection = require('../data/DatabaseConnection.json');

mongoose.connect(databaseConnection.url, function(err){
    if (err) {
        console.log("Error connecting to MongoDB");
        process.exit(1);
    }
});
mongoose.set('useCreateIndex', true);

var bulkUpload = require('./bulkUpload');

bulkUpload.getAndPopulateBulkData()
.then(() => {
    mongoose.disconnect();
});