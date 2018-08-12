var requestPromise = require('request-promise-native');
var Sets = require('../models/sets');

exports.getSet = async (setURI) => ***REMOVED***
    return requestPromise(***REMOVED***
        url: setURI,
        method: "GET",
        headers: ***REMOVED***
            "Content-Type": "application/json",
            "Accept": "application/json"
        ***REMOVED***    
    ***REMOVED***).then(setQuery => ***REMOVED***
        return JSON.parse(setQuery);
    ***REMOVED***).catch((error) => console.log('error getting set ', setURI, error));   
***REMOVED***

exports.populateSetCards = async (cardsResult, setName) => ***REMOVED***
    if(cardsResult) ***REMOVED***
        const cards = cardsResult.results;
        const totalItems = cardsResult.totalItems; 

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
    let token = await TCGAuthentication.getToken();
    let result = await this.getSet(setName, token);
    this.populateSetCards(result, setName);
***REMOVED***;