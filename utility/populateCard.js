//var limit = require("simple-rate-limiter");
//var requestPromise = limit(require('request-promise-native')).to(10).per(1000);
var Card = require('../models/card');
var requestPromise = require('request-promise-native');

const getCard = async (cardID) => {
    return requestPromise({
        url: 'https://api.scryfall.com/cards/' + cardID,
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }    
    }).then((cardData) => {
        return JSON.parse(cardData);
    }).catch((error) => console.log('error getting card with Scryfall ID ', cardID, error));   
}

exports.addCard = async (card) => {
    cardImage = null;
    if (card.image_uris) {
        cardImage = card.image_uris.normal;
    }

    let newCard = {
        scryfallId: card.id,
        name: card.name,
        price: [{value: card.usd}],
        cmc: card.cmc,
        scryfallLink: card.scryfall_uri
    };

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
        console.log("error: " + error);
    });
}

exports.getAndPopulateCard = async (cardID) => {
    let cardData = await getCard(cardURI);
    await addCard(cardData);
}

exports.updateCardPrice = async (cards) => {
    await Promise.all(cards.map(async (card) => {
        try {
            let updatedCard = await getCard(card.scryfallId);
            await sleep(1000);
            console.log(updatedCard.name, "added");
            await Card.updateOne(
                {scryfallId: card.scryfallId},
                {$push: {price: {value: updatedCard.usd}}}
            )
            .catch((error) => {
                console.log("error: " + error);
            });
        } catch (error) {
            console.log(error);
        }
    }));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}