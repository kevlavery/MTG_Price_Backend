var requestPromise = require('request-promise-native');
var TCGAuthentication = require('./token');
var Sets = require('../models/sets');
var AttachCards = require('./attachCardsToSet');

exports.getSets = async (token) => {
    const authorization = 'bearer ' + token;

    return requestPromise({
        url: "https://api.tcgplayer.com/catalog/categories/1/search/manifest", 
        method: "GET",
        headers: {
            "Authorization": authorization,
            "Content-Type": "application/json",
            "Accept": "application/json"  
        }
    }).then((response) => {
        //get list of set names from response
        return JSON.parse(response).results[0].filters[2].items.map((set) => set.text);           
    }).catch((error) => console.log('error getting list of cards: ', error)); 
}

exports.populateSets = async (setResult, token) => {
    await Promise.all(setResult.map(async (set) => {
        try {
            const setQuery = await Sets.findOne({"name": set}).exec();
            //if set doesn't exist in db add it
            if(!setQuery) {
                let newSet = new Sets({
                    name: set
                });
                newSet.save((err) => {
                    if (err) console.log(err);
                });
            }
            setDetails = await AttachCards.getSet(set, token);
            await AttachCards.populateSetCards(setDetails, set);
            console.log(set, ' added');
        } catch (error) {
            console.log(error);
        }
    }));
}

exports.getAndAddSets = async () => {
    let token = await TCGAuthentication.getToken();
    let setsResponse = await this.getSets(token);
    await this.populateSets(setsResponse, token);
}