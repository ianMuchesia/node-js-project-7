const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { checkPermissions } = require("../utils");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.status(StatusCodes.OK).json({ success: true, users });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: `something wrong happened try again later` });
  }
};

const getSingleUser = async (req, res) => {
  console.log("I am here")
  try {
    const { id: userId } = req.params;
    const user = await User.findOne({ role: "user", _id: userId }).select(
      "-password"
    );
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: `no user was found with id:${userId}` });
    }
    checkPermissions(req.user, user._id);
    return res.status(StatusCodes.OK).json({ success: true, user });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: `something wrong happened try again later` });
  }
};

const showCurrentUser = async (req, res) => {
  res.send("Show Current User");
};

const updateUser = async (req, res) => {
  res.send("update user");
};

const updateUserPassword = async (req, res) => {
  res.send("update user password");
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
