var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cardSchema = new Schema({
  scryfallId: Number,
  name: String,
  imageURL: String,
  price: Number
});

module.exports = mongoose.model('cards', cardSchema);