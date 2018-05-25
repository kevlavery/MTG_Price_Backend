var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cardSchema = new Schema(***REMOVED***
  name: String,
  imageURL: String,
  medPrice: Number
***REMOVED***);

module.exports = mongoose.model('cards', cardSchema);