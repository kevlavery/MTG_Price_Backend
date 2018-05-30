var restCredentials = require('../data/TCGConnectionData.json');
var requestPromise = require('request-promise-native');
var Token = require('../models/token');

const data = 'grant_type=client_credentials&client_id='
                + restCredentials.publicKey
                + '&client_secret='
                + restCredentials.privateKey;

exports.getToken = async () => {
    try {
        let tokenQuery = await Token.findOne({}).exec();
        if(!tokenQuery || new Date(tokenQuery.expiry_date) <= Date.now()) {
            tokenQuery = await getRESTToken();
        }
        return tokenQuery.access_token;
    } catch (error) {
        console.log(error);
    }
}

const getRESTToken = () => {
   return rPromise({
        url: "http://api.tcgplayer.com/token", //look to see if they support HTTPS
        method: "POST",
        headers: {
            "Content-Type": "application/json"  
        },
        body: data
    }).then((tokenQuery) => {
        let token = JSON.parse(tokenQuery);
        let currentToken = new Token({
            access_token: token.access_token,
            expiry_date: token['.expires']
        });
        currentToken.save((err) => {
            if (err) console.log(err);
        });
        return token;
    });
    
}



  
