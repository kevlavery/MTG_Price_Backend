const requestPromise = require('request-promise-native');
const promiseLimit = require('promise-limit');
// const { db } = require('../models/card');
const Card = require('../models/card');
const cardTool = require('./addCardData');
 
const getCard = async (cardID) => {
    return requestPromise({
        url: 'https://api.scryfall.com/cards/' + cardID,
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }    
    }).then((cardData) => {
        return JSON.parse(cardData);
    }).catch((error) => console.log('error getting card with Scryfall ID', cardID));   
}

const addCard = async (card) => {
    let newCard = cardTool.populateNewCard(card);

    //updates object or creates new if none found
    Card.findOneAndUpdate(
        {scryfallId: card.id},
        newCard,
        {upsert: true}
    ).exec()
    .catch((error) => {
        console.log("error: " + error + " with scryfall ID" + newCard.scryfallId);
    });
}

const getAndPopulateCard = async (cardID) => {
    let cardData = await getCard(cardURI);
    await addCard(cardData);
}

//updates quickly but with more memory (~4min using ~1200mb)
const updateCardPrice = async () => {
    try {
        let bulkData = await cardTool.getBulkCardData();
        console.log(`${bulkData.length} cards downloaded from scryfall bulk json`);

        let dbContents = await Card.find().lean();
        console.log(`${dbContents.length} cards found in DB`);

        let count = 0;
        let bulkUpdateOps = [];
        // let limit = promiseLimit(10);
        // await Promise.all(cards.map(async (card) => {
        //     return limit(async () => {
        for (const card of dbContents) {
                let bulkDataCard = bulkData.find(scryfallCard => 
                    scryfallCard.id === card.scryfallId
                );

                if (typeof bulkDataCard !== "undefined") {
                    var newPrice = null;
                    if (bulkDataCard.prices.usd !== null) {
                        newPrice = bulkDataCard.prices.usd;
                    } else {
                        newPrice = bulkDataCard.prices.usd_foil;
                    }

                    bulkUpdateOps.push({
                        updateOne: {
                            filter: {scryfallId: card.scryfallId}, 
                            update: {$push: {price: {value: newPrice}}}
                        }
                    });
                    count++;

                    if (count % 500 === 0) {
                        Card.collection.bulkWrite(bulkUpdateOps, { ordered: true, w: 1 }, bulkUpdateCallback);
                        bulkUpdateOps = [];
                        console.log(`${count} cards updated`);
                    }
                    // try {
                    //     await Card.updateOne(
                    //         {scryfallId: card.scryfallId}, 
                    //         {$push: {price: {value: newPrice}}}
                    //     );
                    //     count++;
                    //     if (count % 100 === 0) console.log(`${count} cards updated`);
                    // } catch (error) {
                    //     console.log(`Error updating db for ${card.name} with error ${error}`);
                    // }
                } else {
                    console.log(`scryfallId ${card.scryfallId} not found in bulk json data`)
                }
        //     });
        // }));
        }
    } catch (error) {
        console.log(error);
    }
}

const bulkUpdateCallback = function(err, r){
    console.log(`number matched ${r.matchedCount}`);
    console.log(`number modified ${r.modifiedCount}`);
}

//Updates Cards slowly but uses minimal memory (~40 min using < 250mb)
const updateCardPriceStream = async () => {
    let count = 0;

    let bulkData = await cardTool.getBulkCardData();
    console.log(`${bulkData.length} cards downloaded from scryfall bulk json`);

    let bulkUpdateOps = [];
    for await (const card of Card.find().lean()) {
        let bulkDataCard = bulkData.find(scryfallCard => 
            scryfallCard.id === card.scryfallId
        );

        if (typeof bulkDataCard !== "undefined") {
            var newPrice = null;
            if (bulkDataCard.prices.usd !== null) {
                newPrice = bulkDataCard.prices.usd;
            } else {
                newPrice = bulkDataCard.prices.usd_foil;
            }
            try {
                bulkUpdateOps.push({
                    updateOne: {
                        filter: {scryfallId: card.scryfallId}, 
                        update: {$push: {price: {value: newPrice}}}
                    }
                });
                count++;
            } catch (error) {
                console.log("Error updating database")
            }
            if (count % 500 === 0) {
                Card.collection.bulkWrite(bulkUpdateOps, { ordered: true, w: 1 }, bulkUpdateCallback);
                bulkUpdateOps = [];
                console.log(`${count} cards updated`);
            }
        } else {
            console.log(`scryfallId ${card.scryfallId} not found in bulk json data`)
        }
    }
    console.log(`${count} cards updated.`)
}

module.exports = {
  updateCardPriceStream,
  updateCardPrice,
  getAndPopulateCard,
  addCard,
};