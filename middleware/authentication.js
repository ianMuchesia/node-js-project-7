const {isTokenValid} = require('../utils')
const {StatusCodes } = require('http-status-codes')


const authenticateUser = async (req, res, next)=>{
  const token  = req.signedCookies.token
  console.log(token)

  if(!token){
    return res.status(StatusCodes.UNAUTHORIZED).json({msg: "Authentication Invalid"})
  }
  
  try {
    
    const {name , userId , role } = isTokenValid({token})
    req.user = {name , userId ,  role};
    next()

  } catch (error) {
       return res.status(StatusCodes.UNAUTHORIZED).json({msg: "Authentication Invalid"})
 
  }
}

const authorizePermissions = (...roles)=>{
  return(req, res, next)=>{
    if(!roles.includes(req.user.role)){
      return res.status(StatusCodes.UNAUTHORIZED).json({msg: "Unauthorized to access this route"})
    }
    next()
  }
}


module.exports  = {
  authenticateUser,
  authorizePermissions
}


//(...roles) is a spread syntax in JavaScript that allows you to pass an array of values as individual arguments to a function. In the case of the authorizePermissions function, it takes in a list of roles as parameters and converts them into an array. This allows the function to be flexible and accept any number of roles as arguments, instead of a fixed number of arguments.