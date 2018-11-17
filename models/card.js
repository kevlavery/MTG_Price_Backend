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
    price: Number,
    oracle: String,
    cmc: Number,
    scryfallLink: String,
    faces: ***REMOVED***
      front: ***REMOVED***
        name: String
      ***REMOVED***,
      back: ***REMOVED***
        name: String,
        imageURL: String,
        oracle: String
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
);

module.exports = mongoose.model('cards', cardSchema);