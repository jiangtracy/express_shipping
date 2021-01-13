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
    const validator = jsonschema.validate(req.body, shipmentsSchema);
    if (!validator.valid) {
      let errmessages = validator.errors.map(errMsg => errMsg.stack);
      throw new BadRequestError(errmessages);
    }
    const { productId, name, addr, zip } = req.body;
    const shipId = await shipProduct({ productId, name, addr, zip });
    return res.json({ shipped: shipId });
});


module.exports = router;