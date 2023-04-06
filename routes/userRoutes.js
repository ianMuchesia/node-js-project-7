const express = require("express");
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controllers/userController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const router = express.Router();

router.get("/", authenticateUser, authorizePermissions("admin"), getAllUsers);

router.get("/showMe", authenticateUser, showCurrentUser)
router.patch('/updateUser',authenticateUser, updateUser)
router.patch('/updateUserPassword',authenticateUser, updateUserPassword)
//remember the reason for putting it last
router.get(
  "/:id",
  authenticateUser,
  authorizePermissions("admin"),
  getSingleUser
);

module.exports = router;
