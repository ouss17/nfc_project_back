const { checkBody } = require("../modules/checkBody");
const con = require("../models/connection");
const {
  createHistoric,
  getAllHistoric,
  getOneHistoric,
  getAllHistoricByIdentity,
} = require("../modules/queries/paiementsHistoric_query");

exports.addHistoric = async (req, res) => {
  const { amount, firstname, lastname, email } = req.body;
  if (!checkBody(req.body, ["amount", "firstname", "lastname"])) {
    return res
      .status(400)
      .json({ result: false, error: "Missing or empty fields." });
  }
  try {
    const create = await createHistoric(con, [
      amount,
      firstname,
      lastname,
      email,
    ]);

    if (create.affectedRows === 1) {
      res.json({
        result: true,
        response: "Historique ajouté",
      });
    }
  } catch (error) {
    console.error("Error during add:", error);
    res.status(500).json({ result: false, error: "Internal server error." });
  }
};

exports.retrieveAllHistoric = async (req, res) => {
  const { role } = req.user;
  if (role === "admin") {
    try {
      const historic = await getAllHistoric(con);
      if (historic) {
        res.json({ result: true, data: historic });
      }
    } catch (error) {
      console.error("Error during retrieve:", error);
      res.status(500).json({ result: false, error: "Internal server error." });
    }
  } else {
    res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour accéder à ces données !",
    });
  }
};

exports.retrieveOneHistoric = async (req, res) => {
  const { role } = req.user;
  if (role === "admin") {
    try {
      const historic = await getOneHistoric(con, req.params.idHistoric);
      if (historic) {
        res.json({ result: true, data: historic });
      }
    } catch (error) {
      console.error("Error during retrieve:", error);
      res.status(500).json({ result: false, error: "Internal server error." });
    }
  } else {
    res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour accéder à ces données !",
    });
  }
};

exports.retrieveHistoricByUser = async (req, res) => {
  const { role } = req.user;
  if (role === "admin") {
    try {
      const historic = await getAllHistoricByIdentity(con, [
        req.params.firstname,
        req.params.lastname,
      ]);
      if (historic) {
        res.json({ result: true, data: historic });
      }
    } catch (error) {
      console.error("Error during retrieve:", error);
      res.status(500).json({ result: false, error: "Internal server error." });
    }
  } else {
    res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour accéder à ces données !",
    });
  }
};
