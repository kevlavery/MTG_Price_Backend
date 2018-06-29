var requestPromise = require('request-promise-native');
var TCGAuthentication = require('./token');
var Sets = require('../models/sets');
var PopulateCard = require('./populateCard');

exports.getSet = async (setName, token) => ***REMOVED***
    let bearer = token;
    const authorization = 'bearer ' + bearer;
    let data = ***REMOVED***
        "offset": 0,
        "limit":500,
        "sort": "ProductName DES",
        "filters": [
            ***REMOVED***
                "name": "SetName",
                "values": [
                setName
                ]
            ***REMOVED***
        ]
    ***REMOVED***
    return requestPromise(***REMOVED***
        url: "http://api.tcgplayer.com/catalog/categories/1/search",
        method: "POST",
        headers: ***REMOVED***
            "Authorization": authorization,
            "Content-Type": "application/json",
            "Accept": "application/json"
        ***REMOVED***,
        body: JSON.stringify(data)
    ***REMOVED***).then((setQuery) => ***REMOVED***
        return JSON.parse(setQuery);
    ***REMOVED***);   
***REMOVED***

exports.populateSetCards = async (cardsResult, setName) => ***REMOVED***
    if(cardsResult) ***REMOVED***
        const cards = cardsResult.results;
        const totalItems = cardsResult.totalItems; 

        //add card details to cards collection
        cards.forEach((card) => ***REMOVED***
            PopulateCard.addCard(card)
        ***REMOVED***);

        try ***REMOVED***
            const setQuery = await Sets.findOne(***REMOVED***name : setName***REMOVED***).exec();
    
            if (!setQuery.count || setQuery.count < totalItems) ***REMOVED***
                setQuery.set(***REMOVED***cardIds: cards,
                                count: totalItems***REMOVED***);
                setQuery.save((err) => ***REMOVED***
                    if (err) console.log(err);
                ***REMOVED***);
            ***REMOVED***
        ***REMOVED*** catch (error) ***REMOVED***
            console.log(error);
        ***REMOVED***
    ***REMOVED***
***REMOVED***

exports.getAndPopulateSet = async (setName) => ***REMOVED***
    token = await TCGAuthentication.getToken();
    result = await this.getSet(setName, token);
    this.populateSetCards(result, setName);
***REMOVED***;