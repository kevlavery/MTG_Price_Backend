var express = require('express');
var router = express.Router();
var Card = require('../models/card');

router.get('/', (req, res, next) => ***REMOVED***
    Card.distinct('set').exec((err, sets) => ***REMOVED***
        if(err) ***REMOVED***
            console.log(err);
            res.status(500).send("Database Error");
        ***REMOVED*** else ***REMOVED***
            res.status(200).send(sets.sort());
        ***REMOVED***
    ***REMOVED***)
***REMOVED***);

router.get('/:name', (req, res, next) => ***REMOVED***
    let name = req.params.name;
    Card.find(***REMOVED***"set": name***REMOVED***).exec(async (err, set) => ***REMOVED***
        if(err) ***REMOVED***
            console.log(err);
            res.status(500).send(er);
        ***REMOVED***
        res.status(200).send(set);
    ***REMOVED***);
***REMOVED***);

module.exports = router;