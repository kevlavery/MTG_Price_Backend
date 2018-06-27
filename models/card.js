var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cardSchema = new Schema({
  productId: Number,
  name: String,
  imageURL: String,
  medPrice: Number,
  lowPrice: Number,
  highPrice: Number
});

module.exports = mongoose.model('cards', cardSchema);