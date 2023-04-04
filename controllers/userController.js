


const getAllUser=async(req, res)=>{
    res.send('get All users')
}

const getSingleUser = async(req, res)=>{
    res.send("get Single user")
}

const showCurrentUser = async(req, res)=>{
    res.send("Show Current User")
}

const updateUser = async(req, res)=>{
    res.send("update user")
}

const updateUserPassword= async(req, res)=>{
    res.send("update user password")
}


module.exports = {getAllUser, getSingleUser , showCurrentUser, updateUser, updateUserPassword}