const mongoose = require('mongoose');
const databaseConnection = require('../data/DatabaseConnection.json');
const CardTools = require('./populateCard');

mongoose.connect(databaseConnection.url, function(err){
    if (err) {
    console.log("Error connecting to MongoDB");
    process.exit(1);
    }
});
mongoose.set('useCreateIndex', true);

CardTools.updateCardPriceStream()
.then(() => {
    mongoose.disconnect();
});

