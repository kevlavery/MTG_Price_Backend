var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Sets = require('../models/sets');

/* GET home page. */
router.get('/:name', function(req, res, next) ***REMOVED***
    var name = req.params.name;
    Sets.findOne(***REMOVED***"name": name***REMOVED***).exec((err, set) => ***REMOVED***
        res.status(200).send(set);
        if(err) ***REMOVED***
            console.log(err);
        ***REMOVED***
    ***REMOVED***);
***REMOVED***);

module.exports = router;
