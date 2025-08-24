const Listing = require("../models/listing.js");
const Room = require("../models/room.js");
const User = require("../models/user.js");
const Booking = require("../models/booking.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing Not Found!");
    res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  if (req.file) {
    const { path: url, filename } = req.file;
    newListing.image = { url, filename };
  }
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing Not Found!");
    return res.redirect("/listings");
  }

  let orignalImageUrl = listing.image.url;
  orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/w_250");
  res.render("./listings/edit.ejs", { listing, orignalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

module.exports.bookListingForm = async (req, res) => {
  let { id } = req.params;
  let data = await Listing.findById(id).populate("owner");
  if (!data) {
    req.flash("error", "Listing not found!");
    return res.status(404).redirect("/listing");
  }
  res.status(200).render("listings/book.ejs", { data });
};

module.exports.availableRooms = async (req, res) => {
  let { id } = req.params;
  let bookingData = req.body.booking;
  let listing = await Listing.findById(id).populate({
    path: "rooms",
    populate: {
      path: "bookings",
    },
  });
  let isAvilable = true;
  let availableRooms = [];

  for (let room of listing.rooms) {
    if (room && room.bookings) {
      isAvilable = room.bookings.every(
        (b) =>
          new Date(b.checkin) >= new Date(bookingData.checkout) ||
          new Date(b.checkout) <= new Date(bookingData.checkin)
      );
      if (isAvilable) {
        availableRooms.push(room);
      }
    }
  }

  if (availableRooms.length === 0) {
    req.flash("error", "This listing rooms is not available for the selected dates!");
    return res.status(200).redirect(`/listing/${id}/book`);
  }

  // let newBooking = {
  //   checkin: new Date(bookingData.checkin),
  //   checkout: new Date(bookingData.checkout),
  //   username: "Jay",
  //   guests: {
  //       total: bookingData.totalGuests,
  //       adults: bookingData.adults,
  //       children: bookingData.children || 0
  //   },
  //   customer: res.locals.currUser._id,
  // };

  // listing.bookings.push(newBooking);

  // listing.save();
  res.render("listings/showRooms.ejs", { availableRooms, id, bookingData });
};

module.exports.showBookings = async(req, res) => {
  let userId = res.locals.currUser._id;
  
  let user = await User.findById(userId).populate({
    path: "bookedListing",
    populate: {
      path: "rooms",
      populate: {
        path: "bookings",
        match: { customer: userId } // Only get bookings for this user
      }
    }
  });
  
  // Filter out listings that don't have any bookings
  const bookingData = user.bookedListing.filter(listing => {
    return listing.rooms.some(room => room.bookings && room.bookings.length > 0);
  });
  
  res.status(200).render("listings/myBookings.ejs", { 
    bookingData,
    userId 
  });
}