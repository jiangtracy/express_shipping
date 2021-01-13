"use strict";

//must be before other imports
const shipItApi = require("../shipItApi");
shipItApi.shipProduct = jest.fn();

const request = require("supertest");
const app = require("../app");


describe("POST /", function () {
  test("with mocking, valid", async function () {
    shipItApi.shipProduct
             .mockReturnValue( 1 );

    const resp = await request(app).post("/shipments").send({
          productId: 1000,
          name: "Test Tester",
          addr: "100 Test St",
          zip: "12345-6789",
    });         

    expect(resp.body).toEqual({ shipped: 1 });
  });

  test("with mocking, product id too low", async function () {

    shipItApi.shipProduct
             .mockReturnValue({ 
                "error": {"message": [
                "instance.productId must be greater than or equal to 1000"],
                "status": 400 }}  );
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
    shipItApi.shipProduct
             .mockReturnValue({
               "error": {"message": [
              "instance.productId is not of a type(s) integer"],
                "status": 400 }
              })
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

    shipItApi.shipProduct
             .mockReturnValue({
               "error": {"message": [
              "instance is not allowed to have the additional property \"price\""],
                "status": 400 }
              });

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


  test("test missing properties", async function () {
    shipItApi.shipProduct
             .mockReturnValue({
               "error": {"message": [
              "instance requires property \"name\"",
              "instance requires property \"addr\"",
              "instance requires property \"zip\""],
                "status": 400 }
              });

    const resp = await request(app).post("/shipments").send({
      productId: 1000,
    });

    expect(resp.body).toEqual({"error": {"message": [
      "instance requires property \"name\"",
      "instance requires property \"addr\"",
      "instance requires property \"zip\""],
        "status": 400 }});
  });

});