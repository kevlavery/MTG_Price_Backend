const request = require('request');
const JSONStream = require('JSONStream');
const streamToMongoDB = require('stream-to-mongo-db').streamToMongoDB;
const databaseConnection = require('../data/DatabaseConnection.json');
const { Transform } = require('stream');

const Card = require('../models/card');
const Sets = require('../models/sets');

const scryfallBulkUploadURL = "https://archive.scryfall.com/json/scryfall-all-cards.json";


exports.addCardsToSets = async () => {
    for await (const card of Card.find()) {
        console.log(card.name);
        const setQuery = await Sets.findOne({name : card.set}).exec();
        setQuery.updateOne({$addToSet: {cardIds: card.scryfallId}})
        setQuery.save((err) => {
            if (err) console.log(err);
        });
    }
}



const outputDBConfig = { dbURL : databaseConnection.url, 
    collection : 'cards',
    batchSize : 100 };
const dbWriteStream = streamToMongoDB(outputDBConfig);

const transformCard = new Transform({
    objectMode: true,
    transform(card, encoding, callback) {
        if(card.lang === "en" && !card.digital && card.set_type !== "token") {
            let newCard = {
                scryfallId: card.id,
                name: card.name,
                cmc: card.cmc,
                scryfallLink: card.scryfall_uri,
                set: card.set_name
            };

            //add oracle text and name 
            if (card.layout == "flip" 
                || card.layout == "split" 
                || card.layout == "transform" 
                || card.layout == "double_faced_token") {
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
                newCard.faces.back.imageURL = card.card_faces[1].image_uris.normal;
            } else {
                newCard.imageURL = card.image_uris.normal;
            }

            //push card object to next stream
            this.push(newCard);
        }
        callback();
    }
});

exports.getAndPopulateBulkData = async () => {
    try {
        request.get(scryfallBulkUploadURL)
                .pipe(JSONStream.parse('*'))
                .on('data', function(card) {
                    console.log(card.name);
                })
                .pipe(transformCard)
                .pipe(dbWriteStream);

        //await populateDB(bulkData);
    } catch (error) {
        console.log(error);
    }
}