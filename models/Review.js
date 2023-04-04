const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide rating"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide review title"],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, "Please provide review text"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

//The index() method is a way to tell the computer to keep track of certain pieces of information in the data. The line you provided is telling the computer to create an index based on the product and user fields of the review.

//The {unique: true} part means that each combination of product and user can only have one review. So if someone tries to add a review for a product that they've already reviewed, their new review will replace their old one instead of creating a duplicate.
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });


//agregates perfom complex functions
// The $match operator is used to filter documents that match a certain condition.
//groups the filtered reviews by null (since we don't need to group by any other field) and calculates the average rating and total number of reviews using the $avg and $sum aggregation operators, respectively.



ReviewSchema.statics.calculateAverageRating = async function (productId) {
    const result = await this.aggregate([
      { $match: { product: productId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          numOfReviews: { $sum: 1 },
        },
      },
    ]);
  
    try {
      await this.model('Product').findOneAndUpdate(
        { _id: productId },
        {
          averageRating: Math.ceil(result[0]?.averageRating || 0),
          numOfReviews: result[0]?.numOfReviews || 0,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  
  ReviewSchema.post('save', async function () {
    await this.constructor.calculateAverageRating(this.product);
  });
  
  ReviewSchema.post('remove', async function () {
    await this.constructor.calculateAverageRating(this.product);
  });


 const Review = mongoose.model('Review', ReviewSchema)

 module.exports = Review
  