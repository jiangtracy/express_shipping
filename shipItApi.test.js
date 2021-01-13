"use strict";

const {
  shipProduct,
} = require("./shipItApi");

const AxiosMockAdapter = require(
  "axios-mock-adapter");
const axios = require("axios");
const axiosMock = new AxiosMockAdapter(axios);

test("shipProduct with mocking axios call", async function () {

//import url
  axiosMock.onPost("http://localhost:3001/ship")
           .reply(200, { 
             receipt: {
              itemId: 1000,
              name: "Test Tester",
              addr: "100 Test St",
              zip: "12345-6789",
              shipId: 1
           } });

  const shipId = await shipProduct ({
    productId: 1000,
    name: "Test Tester",
    addr: "100 Test St",
    zip: "12345-6789",
  })

  expect(shipId).toEqual( 1 );
});
