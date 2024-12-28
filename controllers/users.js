const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { checkBody } = require("../modules/checkBody");
const { isValidPassword, isValidEmail } = require("../modules/checkFieldRegex");
const {
  getUserByPseudoOrEmail,
  createUser,
  deleteUser,
  updateUser,
  updateRole,
  updatePassword,
} = require("../modules/users_query");
const JWT_SECRET = process.env.JWT_SECRET;
const con = require("../models/connection");

/**
 * CREATE USER
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.signup = async (req, res) => {
  const { pseudo, email, password, lastname, firstname } = req.body;

  if (!checkBody(req.body, ["pseudo", "email", "password"])) {
    return res
      .status(400)
      .json({ result: false, error: "Missing or empty fields." });
  }

  if (!isValidEmail(email)) {
    return res
      .status(400)
      .json({ result: false, error: "Please enter a valid email." });
  }
  if (!isValidPassword(password)) {
    return res.status(500).json({
      result: false,
      error:
        "Please enter Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.",
    });
  }

  try {
    const user = await getUserByPseudoOrEmail(con, [email, pseudo]);

    if (user.length === 0) {
      const hash = await bcrypt.hash(password, 10);
      try {
        const createQuery = await createUser(con, [
          pseudo,
          email,
          hash,
          lastname,
          firstname,
        ]);
        if (createQuery.affectedRows === 1) {
          res.json({
            result: true,
            response: "Utilisateur créé",
          });
        }
      } catch (error) {
        console.error("Error during signup:", error);
        res
          .status(500)
          .json({ result: false, error: "Internal server error." });
      }
    } else {
      // User already exists in database
      res.json({ result: false, error: "User already exists !" });
    }
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ result: false, error: "Internal server error." });
  }
};

/**
 * CONNECT USER
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.signin = async (req, res) => {
  const { pseudo, password } = req.body;

  if (!checkBody(req.body, ["pseudo", "password"])) {
    return res
      .status(400)
      .json({ result: false, error: "Missing or empty fields." });
  }
  if (!isValidPassword(password)) {
    return res.status(500).json({
      result: false,
      error:
        "Please enter Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.",
    });
  }
  try {
    const user = await getUserByPseudoOrEmail(con, [pseudo, pseudo]);

    if (user.length > 0) {
      const userRes = user[0];
      const comparePasswords = await bcrypt.compare(password, userRes.password);
      if (comparePasswords) {
        const token = jwt.sign(
          {
            id: userRes?.id,
            role: userRes?.role,
            email: userRes?.email,
            pseudo: userRes?.pseudo,
          },

          JWT_SECRET,
          {
            expiresIn: "24h",
          }
        );

        const userSent = {
          pseudo: userRes.pseudo,
          email: userRes.email,
          firstname: userRes.firstname,
          lastname: userRes.lastname,
          role: userRes.role,
          creation_timestamp: userRes.creation_timestamp,
        };

        res
          .cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
          })
          .json({
            result: true,
            data: userSent,
            message: "User connected",
            token,
          });
      } else {
        res.json({ result: false, error: "Mot de passe erroné" });
      }
    } else {
      res.json({ result: false, error: "Utilisateur introuvable" });
    }
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({ result: false, error: "Internal server error." });
  }
};

/**
 * GET CONNECTED USER DATA
 * @param {*} req
 * @param {*} res
 */
exports.getMe = async (req, res) => {
  try {
    const user = await getUserByPseudoOrEmail(con, [
      req.user.pseudo,
      req.user.pseudo,
    ]);
    if (user.length > 0) {
      const userRes = user[0];
      const userSent = {
        pseudo: userRes.pseudo,
        email: userRes.email,
        firstname: userRes.firstname,
        lastname: userRes.lastname,
        role: userRes.role,
        creation_timestamp: userRes.creation_timestamp,
      };
      res.json({
        result: true,
        data: userSent,
      });
    } else {
      res.json({ result: false, error: "Utilisateur introuvable" });
    }
  } catch (error) {
    console.error("Error during retrieve:", error);
    res.status(500).json({ result: false, error: "Internal server error." });
  }
};

/**
 * UPDATE USER
 * @param {*} req
 * @param {*} res
 */
exports.modifyUser = async (req, res) => {
  const {
    pseudo: currentPseudo,
    email: currentEmail,
    role: currentRole,
    id: currentId,
  } = req.user;
  const { pseudo, lastname, firstname } = req.body;
  if (!checkBody(req.body, ["pseudo"])) {
    return res
      .status(400)
      .json({ result: false, error: "Missing or empty fields." });
  }
  try {
    const user = await getUserByPseudoOrEmail(con, [pseudo, pseudo]);

    if (currentPseudo == pseudo) {
      if (currentId == req.params.userId) {
        try {
          const updateQuery = await updateUser(
            con,
            [lastname, firstname, currentId],
            currentPseudo,
            pseudo
          );
          if (updateQuery.affectedRows === 1) {
            const token = jwt.sign(
              {
                id: currentId,
                role: currentRole,
                email: currentEmail,
                pseudo,
              },

              JWT_SECRET,
              {
                expiresIn: "24h",
              }
            );
            res
              .cookie("jwt", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000,
              })
              .json({
                result: true,
                response: "Utilisateur modifié",
              });
          }
        } catch (error) {
          console.error("Error during update:", error);
          res
            .status(500)
            .json({ result: false, error: "Internal server error." });
        }
      } else {
        res.status(400).json({
          result: false,
          error: "Vous n'avez pas les droits pour modifier cet utilisateur !",
        });
      }
    } else if (user.length === 0) {
      if (currentId == req.params.userId) {
        try {
          const updateQuery = await updateUser(
            con,
            [pseudo, lastname, firstname, currentId],
            currentPseudo,
            pseudo
          );
          if (updateQuery.affectedRows === 1) {
            const token = jwt.sign(
              {
                id: currentId,
                role: currentRole,
                email: currentEmail,
                pseudo,
              },

              JWT_SECRET,
              {
                expiresIn: "24h",
              }
            );
            res
              .cookie("jwt", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000,
              })
              .json({
                result: true,
                response: "Utilisateur modifié",
              });
          }
        } catch (error) {
          console.error("Error during update:", error);
          res
            .status(500)
            .json({ result: false, error: "Internal server error." });
        }
      } else {
        res.status(400).json({
          result: false,
          error: "Vous n'avez pas les droits pour modifier cet utilisateur !",
        });
      }
    } else {
      // User already exists in database
      res.json({ result: false, error: "Utilisateur existe deja !" });
    }
  } catch (error) {
    console.error("Error during update:", error);
    res.status(500).json({ result: false, error: "Internal server error." });
  }
};

/**
 * UPADTE USER ROLE
 * @param {*} req
 * @param {*} res
 */
exports.modifyRole = async (req, res) => {
  const {
    pseudo: currentPseudo,
    email: currentEmail,
    role: currentRole,
    id: currentId,
  } = req.user;
  const { role, pseudo } = req.body;
  if (currentRole === "admin") {
    try {
      const user = await getUserByPseudoOrEmail(con, [pseudo, pseudo]);
      if (user.length > 0) {
        try {
          const updateQuery = await updateRole(con, [role, req.params.userId]);
          if (updateQuery.affectedRows === 1) {
            if (currentId == req.params.userId) {
              const token = jwt.sign(
                {
                  id: currentId,
                  role: role,
                  email: currentEmail,
                  currentPseudo,
                },

                JWT_SECRET,
                {
                  expiresIn: "24h",
                }
              );
              res
                .cookie("jwt", token, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "strict",
                  maxAge: 24 * 60 * 60 * 1000,
                })
                .json({
                  result: true,
                  response: "Utilisateur modifié",
                });
            } else {
              res.json({
                result: true,
                response: "Utilisateur modifié",
              });
            }
          }
        } catch (error) {
          console.error("Error during update:", error);
          res
            .status(500)
            .json({ result: false, error: "Internal server error." });
        }
      } else {
        // User already exists in database
        res.json({ result: false, error: "Utilisateur introuvable !" });
      }
    } catch (error) {
      console.error("Error during update:", error);
      res.status(500).json({ result: false, error: "Internal server error." });
    }
  } else {
    res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour modifier cet utilisateur !",
    });
  }
};

/**
 * UPDATE USER PASSWORD
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.modifyPassword = async (req, res) => {
  const {
    pseudo: currentPseudo,
    email: currentEmail,
    role: currentRole,
    id: currentId,
  } = req.user;
  const { newPassword, confirmPassword, lastPassword } = req.body;
  if (
    !isValidPassword(newPassword) ||
    !isValidPassword(confirmPassword) ||
    !isValidPassword(lastPassword)
  ) {
    return res.status(500).json({
      result: false,
      error:
        "Please enter Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.",
    });
  }
  if (newPassword !== confirmPassword) {
    return res.status(500).json({
      result: false,
      error:
        "Le nouveau mot de passe ainsi que sa confirmation doivent être les mêmes !",
    });
  }

  if (newPassword === lastPassword && confirmPassword === lastPassword) {
    return res.status(500).json({
      result: false,
      error: "Veuillez entrer un mot de passe différent du précédent !",
    });
  }

  if (currentId == req.params.userId) {
    try {
      const user = await getUserByPseudoOrEmail(con, [
        currentPseudo,
        currentPseudo,
      ]);
      if (user.length > 0) {
        const comparePasswords = await bcrypt.compare(
          lastPassword,
          user[0].password
        );
        if (comparePasswords) {
          const hash = await bcrypt.hash(confirmPassword, 10);
          try {
            const updateQuery = await updatePassword(con, [
              hash,
              req.params.userId,
            ]);
            if (updateQuery.affectedRows === 1) {
              res.json({
                result: true,
                response: "Utilisateur modifié",
              });
            }
          } catch (error) {
            console.error("Error during update:", error);
            res
              .status(500)
              .json({ result: false, error: "Internal server error." });
          }
        } else {
          res.json({ result: false, error: "Mot de passe erroné" });
        }
      } else {
        // User already exists in database
        res.json({ result: false, error: "Utilisateur introuvable !" });
      }
    } catch (error) {
      console.error("Error during update:", error);
      res.status(500).json({ result: false, error: "Internal server error." });
    }
  } else {
    res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour modifier cet utilisateur !",
    });
  }
};

/**
 * DELETE USER
 * @param {*} req
 * @param {*} res
 */
exports.removeUser = async (req, res) => {
  const { id, email, role } = req.user;

  try {
    const user = await getUserByPseudoOrEmail(con, [email, email]);

    if (user.length > 0) {
      const userRes = user[0];
      if (role == "admin" || id == userRes.id) {
        try {
          const deleteQuery = await deleteUser(con, id);
          if (deleteQuery.affectedRows === 1) {
            res
              .clearCookie("jwt")
              .json({
                result: true,
                response: "Utilisateur supprimé",
              })
              .end();
          }
        } catch (error) {
          console.error("Error during delete:", error);
          res
            .status(500)
            .json({ result: false, error: "Internal server error." });
        }
      } else {
        res.status(400).json({
          result: false,
          error: "Vous n'avez pas les droits pour supprimer cet utilisateur !",
        });
      }
    } else {
      res.json({ result: false, error: "Utilisateur introuvable !" });
    }
  } catch (error) {
    console.error("Error during delete:", error);
    res.status(500).json({ result: false, error: "Internal server error." });
  }
};

/**
 * LOGOUT USER
 * @param {*} req
 * @param {*} res
 */
exports.logout = (req, res) => {
  res.clearCookie("jwt");
  res.json({ result: true });
  res.end();
};
