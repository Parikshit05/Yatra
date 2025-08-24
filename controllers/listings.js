const Listing = require("../models/listing.js");
const Room = require("../models/room.js");
const User = require("../models/user.js");
const Booking = require("../models/booking.js");
const cloudinary = require("cloudinary").v2;

module.exports.index = async (req, res) => {
  // const allListings = await Listing.find({});
  // res.render("./listings/index.ejs", { allListings });
  let allListings = await Listing.find();

  try {
    const category = req.query.category;
    if (category !== undefined) {
      allListings = allListings.filter((data) => data.category === category);
    }
  } catch (err) {
    console.log(err);
  }

  try {
    const searchValue = req.query.q;
    if (searchValue !== undefined) {
      allListings = allListings.filter((data) =>
        data.title.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
  } catch (err) {
    console.log(err);
  }

  res.render("listings/index.ejs", { allListings });
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

  // const fullLocation = `${newListing.location}, ${newListing.country}`;
  // const fullLocation = `${req.body.listing.location}, ${req.body.listing.country}`;
  let fullLocation = req.body.listing.location.trim();
if (!fullLocation.toLowerCase().includes(req.body.listing.country.toLowerCase())) {
  fullLocation += `, ${req.body.listing.country}`;
}


  // Try to get coordinates from geocoding API
  try {
    // const geoRes = await fetch(
    //   `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    //     fullLocation
    //   )}`
    // );
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
        fullLocation
      )}`,
      {
        headers: { "User-Agent": "yatra-app/1.0" }, // Nominatim requires this
      }
    );
    const geoData = await geoRes.json();

    // let geoData = [];
    // if (geoRes.ok) {
    //   const contentType = geoRes.headers.get("content-type");
    //   if (contentType && contentType.includes("application/json")) {
    //     geoData = await geoRes.json();
    //   }
    // }

    if (geoData && geoData.length > 0) {
      const latitude = parseFloat(geoData[0]?.lat) || 0;
      const longitude = parseFloat(geoData[0]?.lon) || 0;

      if (latitude !== 0 && longitude !== 0) {
        newListing.coordinates = { latitude, longitude };
      } else {
        newListing.coordinates = null;
      }
    } else {
      newListing.coordinates = null;
    }
  } catch (geocodingError) {
    console.error("Geocoding API error:", geocodingError);
    // Set coordinates to null when geocoding fails
    newListing.coordinates = null;
  }

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/admin");
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
  // let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  let updatedListing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = { url, filename };
  }

  // const fullLocation = `${req.body.listing.location}, ${req.body.listing.country}`;
  // const fullLocation = `${req.body.listing.location}, ${req.body.listing.country}`;
  let fullLocation = req.body.listing.location.trim();
if (!fullLocation.toLowerCase().includes(req.body.listing.country.toLowerCase())) {
  fullLocation += `, ${req.body.listing.country}`;
}


  // Try to get coordinates from geocoding API
  try {
    // const geoRes = await fetch(
    //   `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    //     fullLocation
    //   )}`
    // );

    // let geoData = [];

    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
        fullLocation
      )}`,
      {
        headers: { "User-Agent": "yatra-app/1.0" }, // Nominatim requires this
      }
    );
    const geoData = await geoRes.json();

    // kch line create listing ke comment se le lena

    if (geoData && geoData.length > 0) {
      const latitude = parseFloat(geoData[0]?.lat) || 0;
      const longitude = parseFloat(geoData[0]?.lon) || 0;

      if (latitude !== 0 && longitude !== 0) {
        updatedListing.coordinates = { latitude, longitude };
      } else {
        updatedListing.coordinates = null;
      }
    } else {
      updatedListing.coordinates = null;
    }
  } catch (geocodingError) {
    console.error("Geocoding API error:", geocodingError);
    // Set coordinates to null when geocoding fails
    updatedListing.coordinates = null;
  }

  await updatedListing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  // let { id } = req.params;
  // await Listing.findByIdAndDelete(id);
  // req.flash("success", "Listing Deleted!");
  // res.redirect("/listings");

  try {
    const { id } = req.params;

    // Find the listing first
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    // Delete the image from Cloudinary if it exists
    if (listing.image && listing.image.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }

    // Delete the listing (this will also trigger your post 'findOneAndDelete' hook to remove reviews)
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong while deleting the listing!");
    res.redirect("/listings");
  }
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
    req.flash(
      "error",
      "This listing rooms is not available for the selected dates!"
    );
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

module.exports.showBookings = async (req, res) => {
  let userId = res.locals.currUser._id;

  let user = await User.findById(userId).populate({
    path: "bookedListing",
    populate: {
      path: "rooms",
      populate: {
        path: "bookings",
        match: { customer: userId }, // Only get bookings for this user
      },
    },
  });

  // Filter out listings that don't have any bookings
  const bookingData = user.bookedListing.filter((listing) => {
    return listing.rooms.some(
      (room) => room.bookings && room.bookings.length > 0
    );
  });

  res.status(200).render("listings/myBookings.ejs", {
    bookingData,
    userId,
  });
};

module.exports.bookRoom = async (req, res) => {
  const bookingData = req.body.booking;
  const payment = {
    payment_id: req.body.razorpay_payment_id,
    order_id: req.body.razorpay_order_id,
    signature: req.body.razorpay_signature,
  };

  let { id, roomId } = req.params;
  let listing = await Listing.findById(id).populate("rooms");
  let room = await Room.findById(roomId).populate("bookings");
  let newBooking = new Booking({
    checkin: new Date(bookingData.checkin),
    checkout: new Date(bookingData.checkout),
    guests: {
      total: bookingData.totalGuests,
      adults: bookingData.adults,
      children: bookingData.children || 0,
    },
    customer: res.locals.currUser._id,
  });

  let user = await User.findById(res.locals.currUser._id);
  user.bookedListing.push(listing._id);
  user.save();

  await newBooking.save();
  await room.bookings.push(newBooking._id);
  await room.save();

  res.status(200).render("payment/success.ejs", { payment });
};
