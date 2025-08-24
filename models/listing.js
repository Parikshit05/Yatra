const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },

  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  category: {
    type: String,
    enum: [
      "trending",
      "city",
      "mountain",
      "beach",
      "forest",
      "desert",
      "castels",
      "house-boat",
      "amazing-pools",
      "farms",
      "island",
      "camping",
    ],
    required: true,
  },
  coordinates: {
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
