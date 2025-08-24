const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
        checkin: {
            type: Date,
            required: true,
        },
        checkout:{
            type: Date,
            required: true,
        },
        guests : {
            total: {
                type: Number,
                required: true,
            },
            adults: {
                type: Number,
                required: true,
            },
            children: {
                type: Number,
                default: 0,
            },
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;