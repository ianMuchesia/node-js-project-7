const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");
const { NotFoundError } = require("../errors");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({
    success: true,
    product,
  });
};
const getAllProducts = async (req, res) => {
  const products = await Product.find({}).sort('-createdAt')
  res.status(StatusCodes.OK).json({
    success:true,
    products
  })
};
const getSingleProduct = async (req, res) => {
  try {
    const {id:productId} = req.params
  const product = await Product.findOne({_id:productId})
  if(!product){
    return res.status(StatusCodes.NOT_FOUND).json({msg:`no product found matching id:${productId}`})

  }
  res.status(StatusCodes.OK).json({
    success:true,
    product
  })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:`something wrong happened try again later`})
  }
  

};


const updateProduct = async (req, res) => {
  try {
    const {id:productId} = req.params

    const product = await Product.findByIdAndUpdate({_id:productId},req.body,{new:true, runValidators:true})

    if(!product){
      return res.status(StatusCodes.NOT_FOUND).json({msg:`no product found matching id:${productId}`})
  
    }

    res.status(StatusCodes.OK).json({
      success:true,
      product
    })
    
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:`something wrong happened try again later`})
  }
};


const deleteProduct = async (req, res) => {
  try {
    const {id:productId} = req.params

    const product = await Product.findOneAndRemove({_id:productId})

    if(!product){
      return res.status(StatusCodes.NOT_FOUND).json({msg:`no product found matching id:${productId}`})
  
    }

    res.status(StatusCodes.OK).json({
      success:true,
      product
    })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:`something wrong happened try again later`})
  }
};
const uploadImage = async (req, res) => {
  res.send("uploadImage");
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
