const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { checkPermissions, createTokenUser, attachCookiesToResponse } = require("../utils");

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
  res.status(StatusCodes.OK).json({success:true, user: req.user });
};

const updateUser = async (req, res) => {
  try {
    const {email , name} = req.body
    if(!email){
      return res.status(StatusCodes.BAD_REQUEST).json({msg:"please provide your email"})
    }
    if(!name){
      return res.status(StatusCodes.BAD_REQUEST).json({msg:"please provide your name"})
    }

    const user = await User.findOne({ _id: req.user.userId });
    console.log(user)

    user.email = email;
    user.name = name;

    await user.save();

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });

    res.status(StatusCodes.OK).json({success:true, user: tokenUser });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: `something wrong happened try again later` });
  }
};

const updateUserPassword = async (req, res) => {
try {
  const { oldPassword, newPassword } = req.body;
  if(!oldPassword || !newPassword){
    return res.status(StatusCodes.BAD_REQUEST).json({msg:"please provide both values"})
  }
  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if (!isPasswordCorrect) {
    return res.status(StatusCodes.UNAUTHORIZED).json({msg:'Invalid Credentials'})
  }

  user.password = newPassword;

  await user.save();
  res.status(StatusCodes.OK).json({success:true, msg: 'Success! Password Updated.' });

} catch (error) {
   console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: `something wrong happened try again later` });
}
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
