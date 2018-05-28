var request = require('request');
var TCGAuthentication = require('./token');
var Sets = require('../models/sets');

exports.populateSet = async (setName) => {
    // let setQuery = await Sets.findOne({"name": setName}).exec();
    //     console.log(setQuery);

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
            //console.log(error);
            const cardsResult = JSON.parse(body);
            const cards = cardsResult.results;
            const totalItems = cardsResult.totalItems; 
            //console.log(cards)
            try {
                //let setQuery = await Sets.findOne({"name": setName}).exec();
                //const setQuery = await Sets.aggregate([{$match: {name: setName}}, {$project:{count:{$size:"$cardIds"}}}]).exec();
                // if (Array.isArray(setQuery) && setQuery.length > 0 && setQuery[0].count < totalItems) {
                //     console.log(setQuery[0].count);

                // }
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