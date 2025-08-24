const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
    highlight: {
        type: String,
    },
    ac: {
        type: Boolean,
        required: true,
        default: false
    }, 
    maxCapacity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    amenities: {
        type: [String]
    },
    bookings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
        }
    ]
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;