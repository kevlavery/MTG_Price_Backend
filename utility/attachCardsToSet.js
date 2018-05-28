var request = require('request');
var TCGAuthentication = require('./token');
var Sets = require('../models/sets');

exports.populateSet = async (setName) => ***REMOVED***
    // let setQuery = await Sets.findOne(***REMOVED***"name": setName***REMOVED***).exec();
    //     console.log(setQuery);

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
            //console.log(error);
            const cardsResult = JSON.parse(body);
            const cards = cardsResult.results;
            const totalItems = cardsResult.totalItems; 
            //console.log(cards)
            try ***REMOVED***
                //let setQuery = await Sets.findOne(***REMOVED***"name": setName***REMOVED***).exec();
                //const setQuery = await Sets.aggregate([***REMOVED***$match: ***REMOVED***name: setName***REMOVED******REMOVED***, ***REMOVED***$project:***REMOVED***count:***REMOVED***$size:"$cardIds"***REMOVED******REMOVED******REMOVED***]).exec();
                // if (Array.isArray(setQuery) && setQuery.length > 0 && setQuery[0].count < totalItems) ***REMOVED***
                //     console.log(setQuery[0].count);

                // ***REMOVED***
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
        ***REMOVED***)
    ***REMOVED***);   
***REMOVED***