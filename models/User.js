const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "please provide name"],
        minlength: 3,
        maxlength: 50,
      },
      email: {
        type: String,
        required: [true, "please provide email"],
        match: [
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          "please provie valid email",
        ],
        unique: true,
      },
      password: {
        type: String,
        required: [true, "please provide password"],
        minlength: 6,
      },
      role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
      },
})


UserSchema.pre("save", async function (next) {
  if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
 
  
  UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  };
  module.exports = mongoose.model("User", UserSchema);





  /* 
  In the context of Mongoose, isModified is a method that can be called on a Mongoose document (i.e., an instance of a model) to check if a particular field or path has been modified since the document was retrieved from the database or since the last time it was saved. It returns a boolean value (true or false) indicating whether the field has been modified or not.
  */