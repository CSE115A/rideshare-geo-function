const functions = require("firebase-functions");
const axios = require("axios");

exports.getGeo = functions.https.onRequest(async (request, response) => {
  const locationEndpoint = functions.config().location.endpoint;
  const apikey = functions.config().location.key;
  let bodyResp = {};
  const address = request.query.address;
  if (address === undefined) {
    // missing address as params
    return response.status(400).send({
      error: true,
      status: 400,
      message: "Params Error: missing or incorrect address format",
    });
  }

  return await axios
    .get(locationEndpoint, {
      params: {
        address,
        key: apikey,
      },
    })
    .then((resp) => {
      if (resp.data.status === "REQUEST_DENIED") {
        return response.status(401).send({
          error: true,
          status: 401,
          message: "Invalid API Key!",
        });
      }
      bodyResp.geo = resp.data.results[0].geometry.location;
      bodyResp.id = resp.data.results[0].place_id;
      return response.status(200).send({
        error: false,
        status: 200,
        message: bodyResp,
      });
    })
    .catch((err) => {
      return response.status(500).send({
        error: true,
        status: 500,
        message: `Internal Server Error: ${err.response.data.error_message}`,
      });
    });
});
