var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    cardId = req.params.id;
    

    res.status(200).send(users);
});

module.exports = router;
