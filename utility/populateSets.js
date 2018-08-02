var requestPromise = require('request-promise-native');
var TCGAuthentication = require('./token');
var Sets = require('../models/sets');
var AttachCards = require('./attachCardsToSet');

exports.getSets = async (token) => ***REMOVED***
    const authorization = 'bearer ' + token;

    return requestPromise(***REMOVED***
        url: "https://api.tcgplayer.com/catalog/categories/1/search/manifest", 
        method: "GET",
        headers: ***REMOVED***
            "Authorization": authorization,
            "Content-Type": "application/json",
            "Accept": "application/json"  
        ***REMOVED***
    ***REMOVED***).then((response) => ***REMOVED***
        //get list of set names from response
        return JSON.parse(response).results[0].filters[2].items.map((set) => set.text);           
    ***REMOVED***).catch((error) => console.log('error getting list of cards: ', error)); 
***REMOVED***

exports.populateSets = async (setResult, token) => ***REMOVED***
    await Promise.all(setResult.map(async (set) => ***REMOVED***
        try ***REMOVED***
            const setQuery = await Sets.findOne(***REMOVED***"name": set***REMOVED***).exec();
            //if set doesn't exist in db add it
            if(!setQuery) ***REMOVED***
                let newSet = new Sets(***REMOVED***
                    name: set
                ***REMOVED***);
                newSet.save((err) => ***REMOVED***
                    if (err) console.log(err);
                ***REMOVED***);
            ***REMOVED***
            setDetails = await AttachCards.getSet(set, token);
            await AttachCards.populateSetCards(setDetails, set);
            console.log(set, ' added');
        ***REMOVED*** catch (error) ***REMOVED***
            console.log(error);
        ***REMOVED***
    ***REMOVED***));
***REMOVED***

exports.getAndAddSets = async () => ***REMOVED***
    let token = await TCGAuthentication.getToken();
    let setsResponse = await this.getSets(token);
    await this.populateSets(setsResponse, token);
***REMOVED***