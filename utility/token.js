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
        
        var expiry_date = new Date(tokenQuery.expiry_date);
        if(expiry_date = Date.now()) {
            await getRESTToken();
            tokenQuery = await Token.findOne({}).exec();
        }
        return tokenQuery.access_token;
    } catch (error) {
        console.log(error);
    }
}

const getRESTToken = async () => {
    return request({
        url: "http://api.tcgplayer.com/token", //look to see if they support HTTPS
        method: "POST",
        headers: {
            "Content-Type": "application/json"  
        },
        body: data
    }, (error, response, body) => {
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



  
