const express = require('express');
const router = express.Router();
const cardUtility = require('../utility/populateCard')
const Card = require('../models/card');
const sanitize = require('mongo-sanitize');

/* GET specified card based on URL parameter scryfallID. */
router.get('/:id', (req, res, next) => ***REMOVED***
    let cardId = req.params.id;
    Card.findOne(***REMOVED***"scryfallId": cardId***REMOVED***).exec(async (err, card) => ***REMOVED***
        if(err) ***REMOVED***
            console.log(err);
            res.status(500).send(err);
        ***REMOVED***

        if(card) ***REMOVED***
            res.status(200).send(card);
        ***REMOVED*** else ***REMOVED***
            try ***REMOVED***
                await cardUtility.getAndPopulateCard(cardId);
                res.redirect(req.originalUrl);
            ***REMOVED*** catch (err) ***REMOVED***
                res.status(500).send(err);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***);
***REMOVED***);

/* POST query for card by name. */
router.post('/', (req, res, next) => ***REMOVED***
    let query = sanitize(req.body.query);
    Card.find(***REMOVED***"name" : new RegExp(".*"+query.trim()+".*", "i")***REMOVED***).exec((err, results) => ***REMOVED***
        if(err) ***REMOVED***
            console.log(err);
            res.status(500).send(err);
        ***REMOVED*** else ***REMOVED***
            res.status(200).send(results);
        ***REMOVED***
    ***REMOVED***)
***REMOVED***);

module.exports = router;
