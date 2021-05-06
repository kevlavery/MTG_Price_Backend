const mongoose = require('mongoose');
const databaseConnection = process.env.MONGODB_URI || require('../data/DatabaseConnection.json');

mongoose.connect(databaseConnection.url, function(err){
    if (err) {
        console.log("Error connecting to MongoDB");
        process.exit(1);
    }
});
mongoose.set('useCreateIndex', true);

const bulkUpload = require('./addCardData');
bulkUpload.addNewCards()
.then(() => {
    mongoose.disconnect();
});