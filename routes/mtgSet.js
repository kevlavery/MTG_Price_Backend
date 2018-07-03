var express = require('express');
var router = express.Router();
var setUtility = require('../utility/attachCardsToSet');
var Sets = require('../models/sets');

/* GET home page. */
router.get('/:name', (req, res, next) => ***REMOVED***
    let name = req.params.name;
    Sets.findOne(***REMOVED***"name": name***REMOVED***).exec(async (err, set) => ***REMOVED***
        if(err) ***REMOVED***
            console.log(err);
            res.status(500).send(err);
        ***REMOVED***

        if(set && set.cardIds.length == set.count) ***REMOVED***
            res.status(200).send(set);
        ***REMOVED*** else ***REMOVED***
            try ***REMOVED***
                await setUtility.getAndPopulateSet(name);
                res.redirect(req.originalUrl);
            ***REMOVED*** catch (err) ***REMOVED***
                res.status(500).send(err);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***);
***REMOVED***);

module.exports = router;
