const Product = require("../models/Product");
const Review = require("../models/Review");
const { StatusCodes } = require("http-status-codes");

const createReview = async (req, res) => {
  try {
    const { product: productId } = req.body;

    const isValidProduct = await Product.findOne({ _id: productId });

    if (!isValidProduct) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `no review found matching id:${productId}` });
    }

    const alreadySubmitted = await Review.findOne({
      product: productId,
      user: req.user.userId,
    });

    if (alreadySubmitted) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `no review found matching id:${productId}` });
    }

    req.body.user = req.user.userId;
    const review = await Review.create(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      review,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: `something wrong happened try again later` });
  }
};

const getSingleReview = async (req, res) => {
  try {
    const { id: reviewId } = req.params;
    const review = await Review.findOne({ _id: reviewId });
    if (!review) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `no review found matching id:${reviewId}` });
    }
    res.status(StatusCodes.OK).json({
      success: true,
      review,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: `something wrong happened try again later` });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({}).sort("-createdAt").populate({
      path: "product",
      select: "name company price",
    });
    res.status(StatusCodes.OK).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: `something wrong happened try again later` });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id: reviewId } = req.params;
    const { rating, title, comment } = req.body;

    const review = await Review.findOne({ _id: reviewId });

    if (!review) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `no review found matching id:${reviewId}` });
    }

    //checkPermissions(req.user, review.user);

    review.rating = rating;
    review.title = title;
    review.comment = comment;

    await review.save();

    res.status(StatusCodes.OK).json({ review });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: `something wrong happened try again later` });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id: reviewId } = req.params;
    const { userId } = req.user;
    const review = await findOne({ _id: reviewId });
    if (!review) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `no review found matching id:${reviewId}` });
    }
    // const deletedReview = await Review.remove(review);
    //is more concise because it uses the built-in remove() method of Mongoose on the review object, which performs the deletion operation directly without the need for a separate call to Review.remove()
    await review.remove();
    res.status(StatusCodes.OK).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: `something wrong happened try again later` });
  }
};

const getSingleProductReviews = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const reviews = await Review.find({ product: productId });
    res.status(StatusCodes.OK).json({
        success:true,
        reviews  });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: `something wrong happened try again later` });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews
};
