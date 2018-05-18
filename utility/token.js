var restCredentials = require('../data/TCGConnectionData.json');
var request = require('request');
var token = require('../models/token')

const data = 'grant_type=client_credentials&client_id='
                + restCredentials.publicKey
                + '&client_secret='
                + restCredentials.privateKey;

exports.getToken = () => {
    request({
        url: "http://api.tcgplayer.com/token", //look to see if they support HTTPS
        method: "POST",
        headers: {
            "content-type": "application/json",  
        },
        body: data
    }, (error, response, body) => {
        var token = JSON.parse(body);
        var currentToken = new token({
            access_token: token.access_token,
            expires_in: token.expires_in,
            expiry_date: token['.expires']
        });
        
        currentToken.save((err) => {
            if (err) console.log(err);
        });
        console.log(currentToken);
    });
}



  
