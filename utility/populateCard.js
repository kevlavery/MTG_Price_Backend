const requestPromise = require('request-promise-native');
const Card = require('../models/card');
const promiseLimit = require('promise-limit');
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

exports.addCard = async (card) => {
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

exports.getAndPopulateCard = async (cardID) => {
    let cardData = await getCard(cardURI);
    await addCard(cardData);
}

//updates quickly but with more memory (~4min using ~1200mb)
exports.updateCardPrice = async (cards) => {
    var limit = promiseLimit(40); //limit number of outstanding promise calls at a time
    var count = 0;

    await Promise.all(cards.map(async (card) => {
        return limit(async () => {
            try {
                //get card data from scryfall API
                var updatedCard = await getCard(card.scryfallId);
                if (updatedCard) {
                    var newPrice = null;
                    if (updatedCard.prices.usd !== null) {
                        newPrice = updatedCard.prices.usd;
                    } else {
                        newPrice = updatedCard.prices.usd_foil;
                    }

                    await Card.updateOne(
                        {scryfallId: card.scryfallId},
                        {$push: {price: {value: newPrice}}}
                    )
                    .catch((error) => {
                        console.log("error updating db" + error);
                    });
                    count++;
                }
            } catch (error) {
                console.log(error);
            }
        })
    }));
    console.log(`${count} cards updated`);
}

//Updates Cards slowly but uses minimal memory (~90 min using < 40mb)
exports.updateCardPriceStream = async () => {
    var count = 0;
    for await (const card of Card.find()) {
        try {
            var updatedCard = await getCard(card.scryfallId);
        } catch (error) {
            console.log(`Couldn't get ${card.name} with error ${error}`);
        }

        if (updatedCard) {
            var newPrice = null;
            if (updatedCard.prices.usd !== null) {
                newPrice = updatedCard.prices.usd;
            } else {
                newPrice = updatedCard.prices.usd_foil;
            }

            try {
                await Card.updateOne(
                    {scryfallId: card.scryfallId}, 
                    {$push: {price: {value: newPrice}}}
                    );
                count++;
            } catch (error) {
                console.log(`Error updating db for ${card.name} with error ${error}`);
            }
            if (count % 100 === 0) console.log(`${count} cards updated`);
        }
    }
    console.log(`${count} cards updated.`)
}