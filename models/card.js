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
    price: Number,
    oracle: String,
    cmc: Number,
    scryfallLink: String,
    faces: {
      front: {
        name: String
      },
      back: {
        name: String,
        imageURL: String,
        oracle: String
      } 
    }
  }
);

module.exports = mongoose.model('cards', cardSchema);