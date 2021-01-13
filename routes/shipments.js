"use strict";

const express = require("express");
const router = new express.Router();

const { shipProduct } = require("../shipItApi");
const { BadRequestError } = require("../expressError.js");

const jsonschema = require("jsonschema");
const shipmentsSchema = require("../schemas/shipmentsSchema.json");

/** POST /ship
 *
 * VShips an order coming from json body:
 *   { productId, name, addr, zip }
 *
 * Returns { shipped: shipId }
 */

router.post("/", async function (req, res, next) {
  console.log("made to route");
  try {
    console.log("inside try");
    const result = jsonschema.validate(req.body, shipmentsSchema);
    if (!result.valid) {
      console.log("inside if");
      let errs = result.errors.map(err => err.stack);
      throw new BadRequestError(errs);
    } else {
      console.log("else");
      const { productId, name, addr, zip } = req.body;
      const shipId = await shipProduct({ productId, name, addr, zip });
      return res.json({ shipped: shipId });
    }
  } catch (err) {
    console.log("inside error");
    return next(err)
  }
});


module.exports = router;