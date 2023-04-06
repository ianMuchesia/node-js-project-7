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
router.get(
  "/:id",
  authenticateUser,

  getSingleUser
);

module.exports = router;
