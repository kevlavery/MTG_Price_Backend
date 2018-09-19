var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var setsSchema = new Schema(***REMOVED***
  name: ***REMOVED*** 
          type: String,  
          unique: true
        ***REMOVED***,
  count: Number,
  searchURI: String,
  cardIds: [String]
***REMOVED***);

module.exports = mongoose.model('set', setsSchema);
