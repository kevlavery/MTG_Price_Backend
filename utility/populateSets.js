var requestPromise = require('request-promise-native');
var Sets = require('../models/sets');
var AttachCards = require('./attachCardsToSet');

exports.getSets = async () => ***REMOVED***
    return requestPromise(***REMOVED***
        url: "https://api.scryfall.com/sets", 
        method: "GET",
        headers: ***REMOVED***
            "Content-Type": "application/json"
        ***REMOVED***
    ***REMOVED***).then((response) => ***REMOVED***
        //get list of set names from response
        return JSON.parse(response).data
        .filter(set => set.set_type !== "token");
    ***REMOVED***).catch((error) => console.log('error getting list of cards: ', error)); 
***REMOVED***

exports.populateSets = async (setResult) => ***REMOVED***
    await Promise.all(setResult.map(async (set) => ***REMOVED***
        try ***REMOVED***
            const setQuery = await Sets.findOne(***REMOVED***"name": set.name***REMOVED***).exec();
            //if set doesn't exist in db add it
            if (!setQuery) ***REMOVED***
                let newSet = new Sets(***REMOVED***
                    name: set.name,
                    count: set.card_count,
                    searchURI: set.search_uri
                ***REMOVED***);
                await newSet.save((err) => ***REMOVED***
                    if (err) console.log(err);
                ***REMOVED***);
                await sleep(1);
                console.log(set.name, ' added');
            ***REMOVED***
            //setDetails = await AttachCards.getSet(set.search_uri);
            //console.log(setDetails);
            //await AttachCards.populateSetCards(setDetails, set);
        ***REMOVED*** catch (error) ***REMOVED***
            console.log(error);
        ***REMOVED***
    ***REMOVED***));
***REMOVED***

function sleep(ms) ***REMOVED***
    return new Promise(resolve => setTimeout(resolve, ms));
  ***REMOVED***