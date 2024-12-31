var express = require("express");
const { auth } = require("../middleware/auth");
const {
  addPrice,
  retrievePrices,
  modifyPrice,
  removePrice,
  retrieveAvailablePrices,
} = require("../controllers/availablePrices");
var router = express.Router();

router.post("/", auth, addPrice);
router.get("/", retrievePrices);
router.get("/available", retrieveAvailablePrices);
router.put("/price/:priceId", auth, modifyPrice);
router.delete("/price/:priceId", auth, removePrice);

module.exports = router;
