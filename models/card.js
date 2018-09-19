var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cardSchema = new Schema(
  {
    scryfallId: {
                  type: String, 
                  unique: true
                },
    name: String,
    imageURL: String,
    price: Number
  }
);

module.exports = mongoose.model('cards', cardSchema);