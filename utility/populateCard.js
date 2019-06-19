var requestPromise = require('request-promise-native');
var Card = require('../models/card');
var promiseLimit = require('promise-limit')
 
var limit = promiseLimit(20)

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
    cardImage = null;
    if (card.image_uris) {
        cardImage = card.image_uris.normal;
    }

    let newCard = {
        scryfallId: card.id,
        name: card.name,
        cmc: card.cmc,
        scryfallLink: card.scryfall_uri,
        set: card.set_name
    };

    if (card.prices.usd !== null) {
        newCard.price = [{value: card.prices.usd}];
    } else if (card.prices.usd !== null) {
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

exports.updateCardPrice = async (cards) => {
    //break down to 100 card batches to reduce memory loads
    let chunkSize = 100;
    let subGroups = []
    let groupSize = Math.ceil(cards.length/chunkSize)
    for(var i = 0; i < groupSize; i++){
        subGroups.push(cards.splice(0, chunkSize))
    }
    count = 0;

    await asyncForEach(subGroups, async (cardGroup) => {
        Promise.all(cardGroup.map(async (card) => {
            return limit(async () => {
                try {
                    let updatedCard = await getCard(card.scryfallId);
                    if (updatedCard) {
                        let newPrice = null;
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
                    }
                } catch (error) {
                    console.log(error);
                }
            })
        }));
        count++;
        console.log("group " + count + " done");
    });
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}