const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/User");
const {StatusCodes} = require('http-status-codes')

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
        throw new BadRequestError("This email is already in use ");
      }
      const user = await User.create({ ...req.body });
  
      const token = user.createJWT();
      
      res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
    } catch (error) {
      next(error);
      console.log(error)
    }
  };

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if ( !password) {
          throw new BadRequestError("please provide your password");
        }
      
        if (!email ) {
            throw new BadRequestError("please provide you email ");
          }

        const user = await User.findOne({ email });
      
        if (!user) {
          throw new UnauthenticatedError("No account found with the above details, please check your email");
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
