var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cardSchema = new Schema(***REMOVED***
  productId: Number,
  name: String,
  imageURL: String,
  medPrice: Number,
  lowPrice: Number,
  highPrice: Number
***REMOVED***);

module.exports = mongoose.model('cards', cardSchema);