const {UnauthenticatedError} = require('../errors');
const {StatusCodes} = require('http-status-codes')


const chechPermissions = (requestUser, resourceUserId) => {
  // console.log(requestUser);
  // console.log(resourceUserId);
  // console.log(typeof resourceUserId);
  if (requestUser.role === 'admin') return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new UnauthenticatedError(
    'Not authorized to access this route'
  );
};

module.exports = chechPermissions;


/* 

It accepts two arguments: requestUser and resourceUserId.
requestUser is the user object extracted from the JWT token.
resourceUserId is the id of the user associated with the resource being accessed.
The function checks if the requestUser has an admin role, if yes, it returns without doing anything else. This is because an admin can access all resources.
The function then checks if the requestUser's userId matches the resourceUserId. If it does, it returns without doing anything else. This is because a user should be able to access their own resources.
If the requestUser does not have an admin role and their userId does not match the resourceUserId, the function throws an UnauthenticatedError with the message "Not authorized to access this route". This is because the user is not authorized to access the resource.
The function is exported and can be used in any route that needs to check if a user is authorized to access a particular resource.

*/