var request = require('request');
var TCGAuthentication = require('./token');
var Sets = require('../models/sets');
var PopulateCard = require('./populateCard');

exports.getSet = async (setName) => ***REMOVED***
    TCGAuthentication.getToken().then((token) => ***REMOVED*** 
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
        request(***REMOVED***
            url: "http://api.tcgplayer.com/catalog/categories/1/search",
            method: "POST",
            headers: ***REMOVED***
                "Authorization": authorization,
                "Content-Type": "application/json",
                "Accept": "application/json"
            ***REMOVED***,
            body: JSON.stringify(data)
        ***REMOVED***, async (error, response, body) => ***REMOVED***
            if (error) console.log('error getting cards for set', setName, ':', error);
            //console.log("REST response");
            //console.log(JSON.parse(body));
            return JSON.parse(body);
        ***REMOVED***)
    ***REMOVED***);   
***REMOVED***

exports.populateSetCards = async (cardsResult, setName) => ***REMOVED***
    console.log("card results");
    console.log(cardsResult);
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
