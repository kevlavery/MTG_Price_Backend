var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tokenSchema = new Schema({
  access_token: String,
  expires_in: Number,
  expiry_date: Date
});

module.exports = mongoose.model('restcredentials', tokenSchema);