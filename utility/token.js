var restCredentials = require('../data/TCGConnectionData.json');
var request = require('request');
var Token = require('../models/token');

const data = 'grant_type=client_credentials&client_id='
                + restCredentials.publicKey
                + '&client_secret='
                + restCredentials.privateKey;

exports.getToken = async () => {
    try {
        let tokenQuery = await Token.findOne({}).exec();
        if(tokenQuery !== null) {
            var expiry_date = new Date(tokenQuery.expiry_date);
            if (expiry_date <= Date.now()) {
                console.log("in if" )
                await getRESTToken();
                tokenQuery = await Token.findOne({}).exec();
                return tokenQuery.access_token;

            }
        } else {
            await getRESTToken();
            tokenQuery = await Token.findOne({}).exec();
            return tokenQuery.access_token;

        }
    } catch (error) {
        console.log(error);
    }
    return tokenQuery.access_token;

}

const getRESTToken = () => {
    return request({
        url: "http://api.tcgplayer.com/token", //look to see if they support HTTPS
        method: "POST",
        headers: {
            "Content-Type": "application/json"  
        },
        body: data
    }, (error, response, body) => {
        console.log('error getting token:', error);
        let token = JSON.parse(body);
        let currentToken = new Token({
            access_token: token.access_token,
            expiry_date: token['.expires']
        });
        
        currentToken.save((err) => {
            if (err) console.log(err);
        });
    });
}



  
