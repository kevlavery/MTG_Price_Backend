var request = require('request');
var TCGAuthentication = require('./token');
var Sets = require('../models/sets');

exports.populateSet = async (setName) => {
    TCGAuthentication.getToken().then((token) => { 
        let bearer = token;
        const authorization = 'bearer ' + bearer;
        let data = {
            "offset": 0,
            "limit":500,
            "sort": "ProductName DES",
            "filters": [
                {
                    "name": "SetName",
                    "values": [
                    setName
                    ]
                }
            ]
        }
        request({
            url: "http://api.tcgplayer.com/catalog/categories/1/search",
            method: "POST",
            headers: {
                "Authorization": authorization,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data)
        }, async (error, response, body) => {
            const cardsResult = JSON.parse(body);
            const cards = cardsResult.results;
            const totalItems = cardsResult.totalItems; 
            try {
                const setQuery = await Sets.findOne({name : setName}).exec();

                if (!setQuery.count || setQuery.count < totalItems) {
                    setQuery.set({cardIds: cards,
                                  count: totalItems});
                    setQuery.save((err) => {
                        if (err) console.log(err);
                    });
                }
            } catch (error) {
                console.log(error);
            }
        })
    });   
}