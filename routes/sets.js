var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var users = [];
    users.push({
        firstName: "Kevin",
        lastName: "Lavery",
        username: "kevlavery",
        email: "email addy"
     });

    res.status(200).send(users);
});

module.exports = router;
