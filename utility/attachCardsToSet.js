var requestPromise = require('request-promise-native');
var Sets = require('../models/sets');
var populateCard = require('./populateCard');

const getSet = async (setURI) => ***REMOVED***
    return requestPromise(***REMOVED***
        url: setURI,
        method: "GET",
        headers: ***REMOVED***
            "Content-Type": "application/json",
            "Accept": "application/json"
        ***REMOVED***    
    ***REMOVED***).then(setContents => ***REMOVED***
        return JSON.parse(setContents);
    ***REMOVED***).catch((error) => console.log('error getting set ', setURI, error));   
***REMOVED***

const populateSetCards = async (cardsResult, setName) => ***REMOVED***
    if (cardsResult) ***REMOVED***
        const cards = cardsResult.data;
        const setQuery = await Sets.findOne(***REMOVED***name : setName***REMOVED***).exec();
        console.log(`Getting cards from $***REMOVED***setName***REMOVED***`);
        
        try ***REMOVED***
            await Promise.all(cards.map(async (card) => ***REMOVED***
                await setQuery.updateOne(***REMOVED***$addToSet: ***REMOVED***cardIds: card.id***REMOVED******REMOVED***);
                populateCard.addCard(card);
                await sleep(1);
                //console.log(card.id + " added");
            ***REMOVED***));
            await setQuery.save((err) => ***REMOVED***
                if (err) console.log(err);
            ***REMOVED***);
        ***REMOVED*** catch (error) ***REMOVED***
            console.log(error);
        ***REMOVED***
    ***REMOVED***
***REMOVED***

exports.getAndPopulateSet = async (setURI, setName) => ***REMOVED***
    let has_more = true;
    let cardURI = setURI;

    //loop to get api data from sets with multiple pages
    while(has_more) ***REMOVED***
        let result = await getSet(cardURI);
        await populateSetCards(result, setName);

        has_more = result.has_more;
        if(has_more) ***REMOVED***
            cardURI = result.next_page;
        ***REMOVED***
    ***REMOVED***
***REMOVED***;

exports.populateAllSets = async (sets) => ***REMOVED***
    await Promise.all(sets.map(async (set) => ***REMOVED***
        if(set && set.count != set.cardIds.length) ***REMOVED***
            await this.getAndPopulateSet(set.searchURI, set.name);
        ***REMOVED***
    ***REMOVED***));
***REMOVED***

function sleep(ms) ***REMOVED***
    return new Promise(resolve => setTimeout(resolve, ms));
***REMOVED***