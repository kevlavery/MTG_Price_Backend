var express = require('express');
var router = express.Router();
var Sets = require('../models/sets');
var Card = require('../models/card');

router.get('/', (req, res, next) => ***REMOVED***
    Sets.find().exec((err, sets) => ***REMOVED***
        let setNames = sets.map(set => set.name); 
        res.status(200).send(setNames);
        if(err) ***REMOVED***
            console.log(err);
        ***REMOVED***
    ***REMOVED***);
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