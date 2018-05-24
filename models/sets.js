var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var setsSchema = new Schema({
  access_token: String,
  expiry_date: Date
});

module.exports = mongoose.model('sets_list', tokenSchema);