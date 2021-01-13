"use strict";

const request = require("supertest");
const app = require("../app");


describe("POST /", function () {
  test("valid", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: expect.any(Number) });
  });

  test("product id too low", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 999,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({"error": {"message": [
          "instance.productId must be greater than or equal to 1000"],
        "status": 400 }});
  });
  
  test("product id not INT", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: "999",
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({"error": {"message": [
      "instance.productId is not of a type(s) integer"],
        "status": 400 }});
  });
  
  test("additional property added", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
      price: 0.00
    });

    expect(resp.body).toEqual({"error": {"message": [
      "instance is not allowed to have the additional property \"price\""],
        "status": 400 }});
  });
});
