var express = require("express");
const { auth } = require("../middleware/auth");
const {
  signin,
  signup,
  removeUser,
  modifyUser,
  logout,
  modifyPassword,
  modifyRole,
  getMe,
} = require("../controllers/users");
var router = express.Router();

/* GET users listing. */
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/getMe", auth, getMe);
router.put("/updateUser/:userId", auth, modifyUser);
router.put("/updatePassword/:userId", auth, modifyPassword);
router.put("/updateRole/:userId", auth, modifyRole);
router.delete("/deleteUser/:userId", auth, removeUser);
router.get("/logout", auth, logout);
module.exports = router;
