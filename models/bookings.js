const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    busName: { type: String, required: true },
    seatNumber: { type: String, required: true },
    date: { type: Number, required: true},
});

// Create a Mongoose model
const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;