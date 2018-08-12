var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cardSchema = new Schema(***REMOVED***
  scryfallId: Number,
  name: String,
  imageURL: String,
  price: Number
***REMOVED***);

module.exports = mongoose.model('cards', cardSchema);