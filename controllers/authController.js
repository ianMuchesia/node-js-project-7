const { BadRequestError } = require("../errors");
const User = require("../models/User");

const register = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      if (!name) {
        throw new BadRequestError("please provide your name");
      }
      if (!email) {
        throw new BadRequestError("please provide your email");
      }
      if (!password) {
        throw new BadRequestError("please provide your password");
      }
      const existingEmail = await User.find({ email });
  
      if (existingEmail.length > 0) {
        throw new BadRequestError("This email already exists");
      }
      const user = await User.create({ ...req.body });
  
      const token = user.createJWT();
      
      res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
    } catch (error) {
      next(error);
    }
  };

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
          throw new BadRequestError("please provide email and password");
        }
      
        const user = await User.findOne({ email });
      
        if (!user) {
          throw new UnauthenticatedError("Invalid Credentials");
        }
      
        //compare password
        const isPasswordCorrect = await user.comparePassword(password);
      
        if (!isPasswordCorrect) {
          throw new UnauthenticatedError("Invalid Credentials");
        }
      
        const token = user.createJWT();
        res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
      
    } catch (error) {
        next(error); 
    }
}

module.exports = {
  register,
  login,
};
