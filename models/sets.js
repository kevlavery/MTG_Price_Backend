var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var setsSchema = new Schema({
  name: { 
          type: String,  
          unique: true
        },
  count: Number,
  searchURI: String
});

module.exports = mongoose.model('set', setsSchema);
