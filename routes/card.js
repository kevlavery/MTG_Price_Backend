var express = require('express');
var router = express.Router();
var cardUtility = require('../utility/populateCard')
var Card = require('../models/card');

/* GET home page. */
router.get('/:id', (req, res, next) => ***REMOVED***
    let cardId = req.params.id;
    Card.findOne(***REMOVED***"scryfallId": cardId***REMOVED***).exec(async (err, card) => ***REMOVED***
        if(err) ***REMOVED***
            console.log(err);
            res.status(500).send(err);
        ***REMOVED***

        if(card) ***REMOVED***
            console.log(card);
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

module.exports = router;
