var requestPromise = require('request-promise-native');
var TCGAuthentication = require('./token');
var Sets = require('../models/sets');
var PopulateCard = require('./populateCard');

exports.getSet = async (setName, token) => {
    const authorization = 'bearer ' + token;
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
    return requestPromise({
        url: "http://api.tcgplayer.com/catalog/categories/1/search",
        method: "POST",
        headers: {
            "Authorization": authorization,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    }).then((setQuery) => {
        return JSON.parse(setQuery);
    }).catch((error) => console.log('error getting set ', setName, error));   
}

exports.populateSetCards = async (cardsResult, setName) => {
    if(cardsResult) {
        const cards = cardsResult.results;
        const totalItems = cardsResult.totalItems; 

        //add card details to cards collection
        // cards.forEach((card) => {
        //     PopulateCard.addCard(card)
        // });

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
    }
}

exports.getAndPopulateSet = async (setName) => {
    let token = await TCGAuthentication.getToken();
    let result = await this.getSet(setName, token);
    this.populateSetCards(result, setName);
};