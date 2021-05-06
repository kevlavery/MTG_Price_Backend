var mongoose = require('mongoose');
const databaseConnection = process.env.MONGODB_URI || require('../data/DatabaseConnection.json');

mongoose.connect(databaseConnection.url, function(err){
    if (err) {
        console.log("Error connecting to MongoDB");
        process.exit(1);
    }
});
mongoose.set('useCreateIndex', true);

var bulkUpload = require('./addCardData');

bulkUpload.getAndPopulateBulkData()
.then(() => {
    mongoose.disconnect();
});