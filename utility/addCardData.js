const request = require('request');
const requestPromise = require('request-promise-native');
const JSONStream = require('JSONStream');
const streamToMongoDB = require('stream-to-mongo-db').streamToMongoDB;
const fs = require('fs');
const { Transform } = require('stream');
const databaseConnection = process.env.MONGODB_URI || require('../data/DatabaseConnection.json');
const Card = require('../models/card');


const scryfallBulkEndpoints = "https://api.scryfall.com/bulk-data";
const bulkDataName = "Default Cards"

const outputDBConfig = { dbURL : databaseConnection.url, 
    collection : 'cards',
    batchSize : 100 };
const dbWriteStream = streamToMongoDB(outputDBConfig);


const getBulkDataEndpoints = async () => {
    return requestPromise({
        url: scryfallBulkEndpoints,
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }    
    }).then((endpointData) => {
        return JSON.parse(endpointData);
    }).catch((error) => console.log('error getting bulk upload endpoint data'));
};

const getBulkCardData = async () => {
    let endPointData = await getBulkDataEndpoints();
    let defaultCardsURL = endPointData.data
                        .filter(endpoint => endpoint.name === bulkDataName)[0]
                        .download_uri;
                        
    return bulkData = await requestPromise({
        url: defaultCardsURL,
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }    
    }).then((endpointData) => {
        return JSON.parse(endpointData);
    }).catch((error) => console.log('error getting bulk data'));
}

const transformCard = new Transform({
    objectMode: true,
    transform(card, encoding, callback) {
        let newCard = exports.populateNewCard(card);
        if(typeof newCard !== "undefined") {
            this.push(newCard); //push card object to next stream
        }
        callback();
    }
});

const populateNewCard = (card) => {
    if (card.lang === "en" 
        && !card.digital 
        && card.set_type !== "token" 
        && card.set_type !== "memorabilia"
    ) {
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
        if (card.layout == "flip" 
            || card.layout == "split" 
            || card.layout == "transform" 
            || card.layout == "double_faced_token"
            || card.layout == "modal_dfc") {
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
        try {
            if (card.layout == "transform" 
                || card.layout == "double_faced_token"
                || card.layout == "modal_dfc") {
                newCard.imageURL = card.card_faces[0].image_uris.normal;
                newCard.faces.back.imageURL = card.card_faces[1].image_uris.normal;
            } else {
                newCard.imageURL = card.image_uris.normal;
            }
        } catch (error) {
            console.log(`ERROR: ${error}`);
            console.log(card.name);
            console.log(card.scryfall_uri);
        }

        return newCard;
    }
};

const getAndPopulateBulkData = async () => {
    try {
        let endPointData = await getBulkDataEndpoints();
        let defaultCardsURL = endPointData.data
                            .filter(endpoint => endpoint.name === bulkDataName)[0]
                            .download_uri;
        request.get(defaultCardsURL)
                .pipe(JSONStream.parse('*'))
                .pipe(transformCard)
                .pipe(dbWriteStream);
    } catch (error) {
        console.log(error);
    }
};

const addNewCards = async () => {
    try {
        let bulkData = await getBulkCardData();
        console.log(`${bulkData.length} cards downloaded from scryfall bulk json`);

        let dbContents = await Card.find().lean();
        console.log(`${dbContents.length} cards found in DB`);

        let mtgFinObjs = bulkData.filter(
            ({ id }) => !dbContents.some(dbItem => id === dbItem.scryfallId)
        ).filter(card => {
            return  typeof card !== "undefined"
                    && card.lang === "en" 
                    && !card.digital 
                    && card.set_type !== "token" 
                    && card.set_type !== "memorabilia"
        }).map(card => {
            return exports.populateNewCard(card);
        });
        console.log(`${mtgFinObjs.length} cards after 2nd filter`);

        let chunkSize = 100;
        cardGroups = [];
        for (let i = 0; i < mtgFinObjs.length; i+=chunkSize) {
            cardGroups.push(mtgFinObjs.slice(i, i+chunkSize));
        }
        let count = 0;
        console.log(`${cardGroups.length} DB write groups made`);
        for (const cardGroup of cardGroups) {
            count++;
            console.log(`adding group ${count}`)
            await Card.insertMany(cardGroup);
        }
        console.log(`${count} cards added`);
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
  addNewCards,
  populateNewCard,
  getAndPopulateBulkData,
  getBulkCardData,
};