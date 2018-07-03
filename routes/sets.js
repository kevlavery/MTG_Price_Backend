var express = require('express');
var router = express.Router();
var Sets = require('../models/sets');

/* GET home page. */
router.get('/', function(req, res, next) ***REMOVED***
    Sets.find().exec((err, sets) => ***REMOVED***
        let setNames = sets.map(set => set.name); 
        res.status(200).send(setNames);
        if(err) ***REMOVED***
            console.log(err);
        ***REMOVED***
    ***REMOVED***);
***REMOVED***);

module.exports = router;
