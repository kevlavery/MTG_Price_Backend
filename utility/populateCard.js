const requestPromise = require('request-promise-native');
const Card = require('../models/card');
const promiseLimit = require('promise-limit');
 
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
    let newCard = {
        scryfallId: card.id,
        name: card.name,
        cmc: card.cmc,
        scryfallLink: card.scryfall_uri,
        set: card.set_name
    };

    //add price data
    if (card.prices.usd !== null) {
        newCard.price = [{value: card.prices.usd}];
    } else {
        newCard.price = [{value: card.prices.usd_foil}];
    }

    //add oracle text and name 
    if (card.layout == "flip" || card.layout == "split" || card.layout == "transform" || card.layout == "double_faced_token") {
        faces = {
            front: {
                name: card.card_faces[0].name
            },
            back: {
                name: card.card_faces[1].name,
                oracle: card.card_faces[1].oracle_text
            }
        }
        
        newCard.oracle = card.card_faces[0].oracle_text;
        newCard.faces = faces;
    } else {
        newCard.oracle = card.oracle_text;
    }

    //add image or both if transform card
    if (card.layout == "transform" || card.layout == "double_faced_token") {
        newCard.imageURL = card.card_faces[0].image_uris.normal;
        newCard.faces.back.imageURL = card.card_faces[1].image_uris.normal;;
    } else {
        newCard.imageURL = card.image_uris.normal;
    }

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
                    console.log(updatedCard.name)
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
                Card.updateOne(
                    {scryfallId: card.scryfallId},
                    {$push: {price: {value: newPrice}}}
                )
                count++;
            } catch (error) {
                console.log(`Error updating db for ${card.name} with error ${error}`);
            }
        }
    }
    console.log(`${count} cards updated.`)
}