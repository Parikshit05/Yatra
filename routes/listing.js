const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const validateBooking = require("../middleware.js").validateBooking;

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//for booing a listing
router.get("/:id/book", isLoggedIn, wrapAsync(listingController.bookListingForm));

router.post(
  "/:id/rooms",
  isLoggedIn,
  validateBooking,
  wrapAsync(listingController.availableRooms)
);

router.post(
  "/:id/book/:roomId",
  isLoggedIn,
  wrapAsync(listingController.bookRoom)
)



//Edit Route
router.get(
  "/:id/edit/",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
