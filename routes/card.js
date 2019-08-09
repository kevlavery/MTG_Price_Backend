const express = require('express');
const router = express.Router();
const cardUtility = require('../utility/populateCard')
const Card = require('../models/card');
const sanitize = require('mongo-sanitize');

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
    let query = sanitize(req.body.query);
    Card.find({"name" : new RegExp(".*"+query+".*", "i")}).exec((err, results) => {
        if(err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.status(200).send(results);
        }
    })
});

module.exports = router;
