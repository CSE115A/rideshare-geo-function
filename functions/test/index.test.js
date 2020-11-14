const { expect } = require("chai");
const { getGeo } = require("../index");
const mockConfig = require("firebase-functions-test")();

const request = {};

const response = {
    status: (status) =>{
        response.statusCode = status;
        return response;
    },
    send: ({ error, status, message }) => {
        response.body = {
          error: error,
          status: status,
          message: message,
        };
        return response;
    },
    set: () => {},
};

describe("Get geolcation", () => {
    beforeEach( () => {
        request.query = {
            address: '1600 Amphitheatre Parkway, Mountain View, CA'
        }
    })
    it("returns 200 message with body", async () => {
        await getGeo(request,response);
        expect(response.statusCode).equal(200);
    });
});

describe("Error", () => {
    beforeEach( () => {
        request.query = { address: "" };
    })
    it('returns 400 internal server error', async () => {
        await getGeo(request,response);
        expect(response.statusCode).equal(500);
    })
})