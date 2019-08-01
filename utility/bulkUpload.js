const requestPromise = require('request-promise-native');
const populateCard = require('./populateCard');
const request = require('request');
const JSONStream = require('JSONStream');
const streamToMongoDB = require('stream-to-mongo-db').streamToMongoDB;
const databaseConnection = require('../data/DatabaseConnection.json');
const { Transform } = require('stream');


const getBulkData = async () => {
    return requestPromise({
        url: "https://archive.scryfall.com/json/scryfall-all-cards.json",
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }    
    }).then(bulkContents => {
        return JSON.parse(bulkContents);
    }).catch((error) => console.log('error retrieving bulk data'));   
}

const populateDB = async (bulkData) => {
    if (bulkData) {
        console.log(typeof bulkData)
        try {
            await Promise.all(bulkData.map(async (card) => {
                //add card to cards collection
                let setQuery = await Sets.findOne({name : card.set_name}).exec();
                if (setQuery) {
                    await populateCard.addCard(card)
                    .catch((error) => {
                        console.log(card.id + " not added to cards DB");
                        console.log(error);
                    });
                    //add card scryfall ID to related set collection
                    await setQuery.updateOne({$addToSet: {cardIds: card.id}})
                    .catch((error) => {
                        console.log(card.id + " not added to sets DB");
                        console.log(error);
                    });
                    await setQuery.save((err) => {
                        if (err) console.log(err);
                    });
                } else {
                    console.log(`${card.setName} not found`);
                }
            }));
        } catch (error) {
            console.log(error);
        }
    }
}

exports.getAndPopulateBulkData = async () => {
    try {
        console.log("Downloadeding bulk data");

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

                    //push card object to next stream
                    this.push(newCard);
                }
                callback();
            }
          });

        request.get("https://archive.scryfall.com/json/scryfall-all-cards.json")
                .pipe(JSONStream.parse('*'))
                .on('data', function(data) {
                    console.log(data.name);
                })
                .pipe(transformCard)
                .pipe(dbWriteStream);
        console.log("Bulk data downloaded");
        //await populateDB(bulkData);
    } catch (error) {
        console.log(error);
    }
}