var express = require("express");
const { auth } = require("../middleware/auth");
const {
  addHistoric,
  retrieveAllHistoric,
  retrieveHistoricByUser,
  retrieveOneHistoric,
} = require("../controllers/paiementsHistoric");
var router = express.Router();

router.post("/", addHistoric);
router.get("/", auth, retrieveAllHistoric);
router.get("/user/:firstname/:lastname", auth, retrieveHistoricByUser);
router.get("/:idHistoric", auth, retrieveOneHistoric);

module.exports = router;
