var requestPromise = require('request-promise-native');
var Sets = require('../models/sets');

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

exports.populateSets = async (setsResult) => ***REMOVED***
    await Promise.all(setsResult.map(async (set) => ***REMOVED***
        addSet: try ***REMOVED***
            const setQuery = await Sets.findOne(***REMOVED***"name": set.name***REMOVED***).exec();
            //don't add if a digital only set (only released on MTGO)
            if (set.digital) ***REMOVED***
                console.log(`Digital set $***REMOVED***set.name***REMOVED*** ignored`);
                break addSet;
            ***REMOVED***

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
                console.log(`$***REMOVED***set.name***REMOVED*** added`);
            //if new cards added to set, update
            ***REMOVED*** else if (setQuery.count != set.card_count) ***REMOVED***
                console.log("updating ", set.name);
                let newSet = ***REMOVED***
                    name: set.name,
                    count: set.card_count,
                    searchURI: set.search_uri
                ***REMOVED***;
                Sets.findOneAndUpdate(
                    ***REMOVED***"name": set.name***REMOVED***,
                    newSet,
                    ***REMOVED***upsert: true***REMOVED***
                ).exec()
                .catch((error) => ***REMOVED***console.log("error: "+error)***REMOVED***);
            ***REMOVED***
        ***REMOVED*** catch (error) ***REMOVED***
            console.log(error);
        ***REMOVED***
    ***REMOVED***));
***REMOVED***

function sleep(ms) ***REMOVED***
    return new Promise(resolve => setTimeout(resolve, ms));
***REMOVED***