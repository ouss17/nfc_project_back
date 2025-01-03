const { checkBody } = require("../modules/checkBody");
const con = require("../models/connection");
const {
  createPrice,
  getAllPrices,
  updatePrice,
  deletePrice,
  getAllAvailablePrices,
} = require("../modules/queries/availablePrices_query");

exports.addPrice = async (req, res) => {
  const { role } = req.user;
  const { amount, isAvailable } = req.body;
  if (!checkBody(req.body, ["amount", "isAvailable"])) {
    return res
      .status(400)
      .json({ result: false, error: "Missing or empty fields." });
  }
  if (role === "admin") {
    try {
      const price = await createPrice(con, [amount, isAvailable]);
      if (price.affectedRows === 1) {
        res.json({
          result: true,
          response: "Tarif ajouté",
        });
      }
    } catch (error) {
      console.error("Error during create:", error);
      res.status(500).json({ result: false, error: "Internal server error." });
    }
  } else {
    res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour ajouter un tarif !",
    });
  }
};

exports.retrievePrices = async (req, res) => {
  try {
    const prices = await getAllPrices(con);
    if (prices) {
      res.json({ result: true, data: prices });
    }
  } catch (error) {
    console.error("Error during retrieve:", error);
    res.status(500).json({ result: false, error: "Internal server error." });
  }
};

exports.retrieveAvailablePrices = async (req, res) => {
  try {
    const prices = await getAllAvailablePrices(con);
    if (prices) {
      res.json({ result: true, data: prices });
    }
  } catch (error) {
    console.error("Error during retrieve:", error);
    res.status(500).json({ result: false, error: "Internal server error." });
  }
};

exports.modifyPrice = async (req, res) => {
  const { role } = req.user;
  const { amount, isAvailable } = req.body;
  if (!checkBody(req.body, ["amount", "isAvailable"])) {
    return res
      .status(400)
      .json({ result: false, error: "Missing or empty fields." });
  }
  if (role === "admin") {
    try {
      const price = await updatePrice(con, [
        amount,
        isAvailable,
        req.params.priceId,
      ]);
      if (price.affectedRows === 1) {
        res.json({
          result: true,
          response: "Tarif modifié",
        });
      }
    } catch (error) {
      console.error("Error during update:", error);
      res.status(500).json({ result: false, error: "Internal server error." });
    }
  } else {
    res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour modifier un tarif !",
    });
  }
};

exports.removePrice = async (req, res) => {
  const { role } = req.user;
  if (role === "admin") {
    try {
      const price = await deletePrice(con, [req.params.priceId]);
      if (price.affectedRows === 1) {
        res.json({
          result: true,
          response: "Tarif supprimé",
        });
      }
    } catch (error) {
      console.error("Error during delete:", error);
      res.status(500).json({ result: false, error: "Internal server error." });
    }
  } else {
    res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour supprimer un tarif !",
    });
  }
};
