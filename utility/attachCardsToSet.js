var requestPromise = require('request-promise-native');
var Sets = require('../models/sets');
var populateCard = require('./populateCard');

const getSet = async (setURI) => {
    return requestPromise({
        url: setURI,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }    
    }).then(setContents => {
        return JSON.parse(setContents);
    }).catch((error) => console.log('error getting set ', setURI, error));   
}

const populateSetCards = async (cardsResult, setName) => {
    if (cardsResult) {
        const cards = cardsResult.data;
        const setQuery = await Sets.findOne({name : setName}).exec();
        console.log(`Getting cards from ${setName}`);
        
        try {
            await Promise.all(cards.map(async (card) => {
                await populateCard.addCard(card)
                      .catch((error) => {
                          console.log(card.id + " not added to cards DB");
                          console.log(error);
                      });
                await setQuery.updateOne({$addToSet: {cardIds: card.id}})
                      .catch((error) => {
                          console.log(card.id + " not added to sets DB");
                          console.log(error);
                      });
                await sleep(1);
            }));
            await setQuery.save((err) => {
                if (err) console.log(err);
            });
        } catch (error) {
            console.log(error);
        }
    }
}

exports.getAndPopulateSet = async (setURI, setName) => {
    let has_more = true;
    let cardURI = setURI;

    //loop to get api data from sets with multiple pages
    try {
        while(has_more) {
            let result = await getSet(cardURI);
            await populateSetCards(result, setName);

            has_more = result.has_more;
            if(has_more) {
                cardURI = result.next_page;
            }
        }
    } catch (error) {
        console.log(error)
    }
};

exports.populateAllSets = async (sets) => {
    console.log("populating sets")
    await Promise.all(sets.map(async (set) => {
        if(set && set.count != set.cardIds.length) {
            await this.getAndPopulateSet(set.searchURI, set.name);
        }
    }));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}