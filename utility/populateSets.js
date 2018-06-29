var requestPromise = require('request-promise-native');
var TCGAuthentication = require('./token');
var Sets = require('../models/sets');
var AttachCards = require('./attachCardsToSet');

exports.getSets = async () => ***REMOVED***
    TCGAuthentication.getToken().then((token) => ***REMOVED*** 
        let bearer = token;
        const authorization = 'bearer ' + bearer;

        return requestPromise(***REMOVED***
            url: "https://api.tcgplayer.com/catalog/categories/1/search/manifest", 
            method: "GET",
            headers: ***REMOVED***
                "Authorization": authorization,
                "Content-Type": "application/json",
                "Accept": "application/json"  
            ***REMOVED***
        ***REMOVED***).then(() => ***REMOVED***
            //get list of set names from response
            if(error) console.log('error getting list of cards:', error);
            return JSON.parse(body).results[0].filters[2].items;           
        ***REMOVED***);
    ***REMOVED***);   
***REMOVED***

exports.populateSets = async (setResult) => ***REMOVED***
    setResult.forEach(async (set) => ***REMOVED***
        try ***REMOVED***
            const setQuery = await Sets.findOne(***REMOVED***"name": set.text***REMOVED***).exec();
            //if set doesn't exist in db add it
            if(!setQuery) ***REMOVED***
                let newSet = new Sets(***REMOVED***
                    name: set.text
                ***REMOVED***);
                newSet.save((err) => ***REMOVED***
                    if (err) console.log(err);
                ***REMOVED***);
            ***REMOVED***
            setDetails = await AttachCards.getSet(set.text);
            AttachCards.populateSetCards(setDetails, set.text);
        ***REMOVED*** catch (error) ***REMOVED***
            console.log(error);
        ***REMOVED***
    ***REMOVED***);
***REMOVED***



  
