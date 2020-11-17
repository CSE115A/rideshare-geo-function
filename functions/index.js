const functions = require("firebase-functions");
const axios = require("axios");

exports.getGeo = functions.https.onRequest(async (request, response) => {
  const locationEndpoint = functions.config().location.endpoint;
  const apikey = functions.config().location.key;
  const address = request.query.address;

  if (address === undefined) {
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
        return response.status(500).send({
          error: true,
          status: 500,
          message: "Invalid API Key Set!",
        });
      }

      return response.status(200).send({
        error: false,
        status: 200,
        message: {
          geo: resp.data.results[0].geometry.location,
          id: resp.data.results[0].place_id,
        },
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
