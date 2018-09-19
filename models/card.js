var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cardSchema = new Schema(
  ***REMOVED***
    scryfallId: ***REMOVED***
                  type: String, 
                  unique: true
                ***REMOVED***,
    name: String,
    imageURL: String,
    price: Number
  ***REMOVED***
);

module.exports = mongoose.model('cards', cardSchema);