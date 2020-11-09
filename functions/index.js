const functions = require('firebase-functions');
const axios = require('axios');

exports.getGeo = functions.https.onRequest(async (request, response) =>{
    // parse request 
    // request should contian source and destination address
    let url = 'https://maps.googleapis.com/maps/api/geocode/json'
    let apikey = functions.config().location.key
    let bodyResp = {}
    try{
        let address = request.query.address;
        await axios.get(url,{
            params: {
                address: address,
                key: apikey
            }
        })
        .then( res => {
            bodyResp.geo = res.data.results[0].geometry.location;
            bodyResp.id = res.data.results[0].place_id;
            return response.status(200).send({
                error: false,
                status: 200,
                message: bodyResp
            });
        })
        .catch ( err => {
            functions.logger.error(err);
            return response.status(500).send({
                error: true,
                status: 500,
                message: "Internal Server Error, try again"
            });
        })
    } catch (err){
        // invalid request body
        functions.logger.error(err);
        return response.status(400).send({
            error: true,
            status: 400,
            message: "Params Error: missing or incorrect address format"

        });
    }
});