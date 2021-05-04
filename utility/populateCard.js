const requestPromise = require('request-promise-native');
const Card = require('../models/card');
const promiseLimit = require('promise-limit');
const cardTool = require('./addCardData');
 
const getCard = async (cardID) => ***REMOVED***
    return requestPromise(***REMOVED***
        url: 'https://api.scryfall.com/cards/' + cardID,
        method: "GET",
        headers: ***REMOVED***
            "Content-Type": "application/json"
        ***REMOVED***    
    ***REMOVED***).then((cardData) => ***REMOVED***
        return JSON.parse(cardData);
    ***REMOVED***).catch((error) => console.log('error getting card with Scryfall ID', cardID));   
***REMOVED***

exports.addCard = async (card) => ***REMOVED***
    let newCard = cardTool.populateNewCard(card);

    //updates object or creates new if none found
    Card.findOneAndUpdate(
        ***REMOVED***scryfallId: card.id***REMOVED***,
        newCard,
        ***REMOVED***upsert: true***REMOVED***
    ).exec()
    .catch((error) => ***REMOVED***
        console.log("error: " + error + " with scryfall ID" + newCard.scryfallId);
    ***REMOVED***);
***REMOVED***

exports.getAndPopulateCard = async (cardID) => ***REMOVED***
    let cardData = await getCard(cardURI);
    await addCard(cardData);
***REMOVED***

//updates quickly but with more memory (~4min using ~1200mb)
exports.updateCardPrice = async (cards) => ***REMOVED***
    var limit = promiseLimit(40); //limit number of outstanding promise calls at a time
    var count = 0;

    await Promise.all(cards.map(async (card) => ***REMOVED***
        return limit(async () => ***REMOVED***
            try ***REMOVED***
                //get card data from scryfall API
                var updatedCard = await getCard(card.scryfallId);
                if (updatedCard) ***REMOVED***
                    var newPrice = null;
                    if (updatedCard.prices.usd !== null) ***REMOVED***
                        newPrice = updatedCard.prices.usd;
                    ***REMOVED*** else ***REMOVED***
                        newPrice = updatedCard.prices.usd_foil;
                    ***REMOVED***

                    await Card.updateOne(
                        ***REMOVED***scryfallId: card.scryfallId***REMOVED***,
                        ***REMOVED***$push: ***REMOVED***price: ***REMOVED***value: newPrice***REMOVED******REMOVED******REMOVED***
                    )
                    .catch((error) => ***REMOVED***
                        console.log("error updating db" + error);
                    ***REMOVED***);
                    count++;
                ***REMOVED***
            ***REMOVED*** catch (error) ***REMOVED***
                console.log(error);
            ***REMOVED***
        ***REMOVED***)
    ***REMOVED***));
    console.log(`$***REMOVED***count***REMOVED*** cards updated`);
***REMOVED***

//Updates Cards slowly but uses minimal memory (~90 min using < 40mb)
exports.updateCardPriceStream = async () => ***REMOVED***
    var count = 0;
    for await (const card of Card.find()) ***REMOVED***
        try ***REMOVED***
            var updatedCard = await getCard(card.scryfallId);
        ***REMOVED*** catch (error) ***REMOVED***
            console.log(`Couldn't get $***REMOVED***card.name***REMOVED*** with error $***REMOVED***error***REMOVED***`);
        ***REMOVED***

        if (updatedCard) ***REMOVED***
            var newPrice = null;
            if (updatedCard.prices.usd !== null) ***REMOVED***
                newPrice = updatedCard.prices.usd;
            ***REMOVED*** else ***REMOVED***
                newPrice = updatedCard.prices.usd_foil;
            ***REMOVED***

            try ***REMOVED***
                await Card.updateOne(
                    ***REMOVED***scryfallId: card.scryfallId***REMOVED***, 
                    ***REMOVED***$push: ***REMOVED***price: ***REMOVED***value: newPrice***REMOVED******REMOVED******REMOVED***
                    );
                count++;
            ***REMOVED*** catch (error) ***REMOVED***
                console.log(`Error updating db for $***REMOVED***card.name***REMOVED*** with error $***REMOVED***error***REMOVED***`);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
    console.log(`$***REMOVED***count***REMOVED*** cards updated.`)
***REMOVED***