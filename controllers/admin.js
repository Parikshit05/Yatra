const Listing = require("../models/listing");
const Room = require("../models/room");

module.exports.showAdminDashboard = async (req, res) => {
    let id = res.locals.currUser._id;
    let datas = await Listing.find({owner: id}).populate("owner");
    
    res.status(200).render("admin/admin.ejs", { datas });
}

module.exports.addRoomForm = async (req, res) => {
    let { id } = req.params;
    res.status(200).render("admin/addRoomForm.ejs", { id });
}

module.exports.addRoom = async (req, res) => {
    let { id } = req.params;
    let room = new Room(req.body.room);
    await room.save();
    let listing = await Listing.findById(id);
    listing.rooms.push(room._id);
    await listing.save();
    req.flash("success", "Room added successfully");
    res.status(200).redirect(`/admin/${id}`);
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id).populate("rooms").populate("owner");
    res.status(200).render("admin/adminShow.ejs", { data });
}