const { expect } = require("chai");
const { getGeo } = require("../index");
const mockConfig = require("firebase-functions-test")();

const request = {};

const response = {
  status: (status) => {
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

describe("Calling getGeo with proper params", () => {
  beforeEach(() => {
    request.query = {
      address: "1600 Amphitheatre Parkway, Mountain View, CA",
    };
  });
  it("Returns 200 with proper body", async () => {
    await getGeo(request, response);
    expect(response.statusCode).equal(200);
  });
});

describe("undefined query", () => {
  beforeEach(() => {
    request.query = { undefined };
  });
  it("returns 400 incorrect fields", async () => {
    await getGeo(request, response);
    expect(response.statusCode).equal(400);
  });
});
describe("Missing API key", () => {
  beforeEach(() => {
    mockConfig.mockConfig({
      location: { key: "fake" },
    });
    request.query = { address: "1600 Amphitheatre Parkway, Mountain View, CA" };
  });
  it("Returns 500 Internal Server Error", async () => {
    await getGeo(request, response);
    expect(response.statusCode).equal(500);
  });
});

describe("Missing Query", () => {
  it("Returns 400 improper request", async () => {
    await getGeo({}, response);
    expect(response.statusCode).equal(400);
  });
});
