var requestPromise = require('request-promise-native');
var Sets = require('../models/sets');
var AttachCards = require('./attachCardsToSet');

exports.getSets = async () => {
    return requestPromise({
        url: "https://api.scryfall.com/sets", 
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => {
        //get list of set names from response
        return JSON.parse(response).data
        .filter(set => set.set_type !== "token");
    }).catch((error) => console.log('error getting list of cards: ', error)); 
}

exports.populateSets = async (setResult) => {
    await Promise.all(setResult.map(async (set) => {
        try {
            const setQuery = await Sets.findOne({"name": set.name}).exec();
            //if set doesn't exist in db add it
            if (!setQuery) {
                let newSet = new Sets({
                    name: set.name,
                    count: set.card_count,
                    searchURI: set.search_uri
                });
                await newSet.save((err) => {
                    if (err) console.log(err);
                });
                await sleep(1);
                console.log(set.name, ' added');
            }
            //setDetails = await AttachCards.getSet(set.search_uri);
            //console.log(setDetails);
            //await AttachCards.populateSetCards(setDetails, set);
        } catch (error) {
            console.log(error);
        }
    }));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }