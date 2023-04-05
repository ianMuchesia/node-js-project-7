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

router.get("/", getAllUsers);
router.get(
  "/:id",
  authenticateUser,
  authorizePermissions("admin"),
  getSingleUser
);

module.exports = router;
