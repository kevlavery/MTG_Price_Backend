var restCredentials = require('../data/TCGConnectionData.json');
var request = require('request');
var Token = require('../models/token')

const data = 'grant_type=client_credentials&client_id='
                + restCredentials.publicKey
                + '&client_secret='
                + restCredentials.privateKey;

exports.getToken = async() => {
    let token = "empty";
    let tokenQuery = Token.findOne();
    tokenQuery.select("access_token expiry_date");
    tokenQuery.exec((err, dbToken) => {
        if (err) console.log(err);

        //console.log(dbToken.access_token);
        var expiry_date = new Date(dbToken.expiry_date);
        if(expiry_date >= Date.now()) {
            token = getRESTToken();
            //console.log(token)
        } else {
            token = dbToken.access_token.toString();
            //console.log(dbToken.access_token)
        }
        return token;
    });
    return token;
}

getRESTToken = () => {
    request({
        url: "http://api.tcgplayer.com/token", //look to see if they support HTTPS
        method: "POST",
        headers: {
            "content-type": "application/json"  
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
        return token.access_token;
    });
}



  
