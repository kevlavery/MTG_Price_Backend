const request = require('request');
const JSONStream = require('JSONStream');
const streamToMongoDB = require('stream-to-mongo-db').streamToMongoDB;
const databaseConnection = require('../data/DatabaseConnection.json');
const ***REMOVED*** Transform ***REMOVED*** = require('stream');

const Card = require('../models/card');
const Sets = require('../models/sets');


exports.addCardsToSets = async () => ***REMOVED***
    for await (const card of Card.find()) ***REMOVED***
        console.log(card.name);
        const setQuery = await Sets.findOne(***REMOVED***name : card.set***REMOVED***).exec();
        setQuery.updateOne(***REMOVED***$addToSet: ***REMOVED***cardIds: card.scryfallId***REMOVED******REMOVED***)
        setQuery.save((err) => ***REMOVED***
            if (err) console.log(err);
        ***REMOVED***);
    ***REMOVED***
***REMOVED***



const outputDBConfig = ***REMOVED*** dbURL : databaseConnection.url, 
    collection : 'cards',
    batchSize : 100 ***REMOVED***;

const dbWriteStream = streamToMongoDB(outputDBConfig);

const transformCard = new Transform(***REMOVED***
    objectMode: true,
    transform(card, encoding, callback) ***REMOVED***
        if(card.lang === "en" && !card.digital && card.set_type !== "token") ***REMOVED***
            let newCard = ***REMOVED***
                scryfallId: card.id,
                name: card.name,
                cmc: card.cmc,
                scryfallLink: card.scryfall_uri,
                set: card.set_name
            ***REMOVED***;

            //add oracle text and name 
            if (card.layout == "flip" 
                || card.layout == "split" 
                || card.layout == "transform" 
                || card.layout == "double_faced_token") ***REMOVED***
                faces = ***REMOVED***
                    front: ***REMOVED***
                        name: card.card_faces[0].name
                    ***REMOVED***,
                    back: ***REMOVED***
                        name: card.card_faces[1].name,
                        oracle: card.card_faces[1].oracle_text
                    ***REMOVED***
                ***REMOVED***
                newCard.oracle = card.card_faces[0].oracle_text;
                newCard.faces = faces;
            ***REMOVED*** else ***REMOVED***
                newCard.oracle = card.oracle_text;
            ***REMOVED***

            //add image or both if transform card
            if (card.layout == "transform" || card.layout == "double_faced_token") ***REMOVED***
                newCard.imageURL = card.card_faces[0].image_uris.normal;
                newCard.faces.back.imageURL = card.card_faces[1].image_uris.normal;
            ***REMOVED*** else ***REMOVED***
                newCard.imageURL = card.image_uris.normal;
            ***REMOVED***

            //push card object to next stream
            this.push(newCard);
        ***REMOVED***
        callback();
    ***REMOVED***
***REMOVED***);

exports.getAndPopulateBulkData = async () => ***REMOVED***
    try ***REMOVED***
        request.get("https://archive.scryfall.com/json/scryfall-all-cards.json")
                .pipe(JSONStream.parse('*'))
                .on('data', function(data) ***REMOVED***
                    console.log(data.name);
                ***REMOVED***)
                .pipe(transformCard)
                .pipe(dbWriteStream);

        //await populateDB(bulkData);
    ***REMOVED*** catch (error) ***REMOVED***
        console.log(error);
    ***REMOVED***
***REMOVED***