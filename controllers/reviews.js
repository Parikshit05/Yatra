const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};

module.exports.renderEditForm = async (req, res) => {
  let { id, reviewId } = req.params;
  const listing = await Listing.findById(id);
  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review Not Found!");
    return res.redirect(`/listings/${id}`);
  }

  res.render("./listings/editReview.ejs", { listing, review });
};

module.exports.updateReview = async (req, res) => {
  let { id, reviewId } = req.params;
  const listing = await Listing.findById(id);
  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review Not Found!");
    return res.redirect(`/listings/${id}`);
  }

  Object.assign(review, req.body.review);
  await review.save();
  req.flash("success", "Review Updated!");
  res.redirect(`/listings/${id}`);
};
