var express = require('express');
var router = express.Router();
var cardUtility = require('../utility/populateCard')
var Card = require('../models/card');

/* GET specified card based on URL parameter scryfallID. */
router.get('/:id', (req, res, next) => {
    let cardId = req.params.id;
    Card.findOne({"scryfallId": cardId}).exec(async (err, card) => {
        if(err) {
            console.log(err);
            res.status(500).send(err);
        }

        if(card) {
            res.status(200).send(card);
        } else {
            try {
                await cardUtility.getAndPopulateCard(cardId);
                res.redirect(req.originalUrl);
            } catch (err) {
                res.status(500).send(err);
            }
        }
    });
});

/* POST query for card by name. */
router.post('/', (req, res, next) => {
    let query = req.body.query;
    console.log(query);
    Card.find({"name" : {$regex : ".*"+query+".*"}}).exec((err, results) => {
        if(err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.status(200).send(results);
        }
    })
});

module.exports = router;
