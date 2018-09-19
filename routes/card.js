var express = require('express');
var router = express.Router();
var cardUtility = require('../utility/populateCard')
var Card = require('../models/card');

/* GET home page. */
router.get('/:id', (req, res, next) => {
    let cardId = req.params.id;
    Card.findOne({"scryfallId": cardId}).exec(async (err, card) => {
        if(err) {
            console.log(err);
            res.status(500).send(err);
        }

        if(card) {
            console.log(card);
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

module.exports = router;
