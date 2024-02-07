const mongoose = require('mongoose');

// const tripSchema = mongoose.Schema({
//     date: {
//         type: Number,
//         require: true

//     },
//     from: {
//         type: String,
//         require: true
//     },
//     to: {
//         type: String,
//         require: true
//     },
//     busOwnerID: {
//         type: Number,
//         require: true
//     },
//     startTime: {
//         type: Number,
//         require: true
//     },
//     EndTime: {
//         type: Number,
//         require: true
//     },
//     category: {
//         type: String,
//         require: true
//     },
//     SeatBooked: {
//         type: Array,
//         require: true
//     },
//     bus_no: {
//         type: String,
//         require: true
//     },
//     animeties_list: {
//         type: Array,
//         require: true
//     },

//     busFare: {
//         type: Number,
//         require: true
//     },
//     busName: {
//         type: String,
//         require: true
//     },
// })

// const Trip = mongoose.model('Trip', tripSchema)

// module.exports = Trip;


// const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    date: { type: Number, required: true},
    from: { type: String, required: true },
    to: { type: String, required: true },
    busOwnerID: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    category: { type: String, required: true },
    seatBooked: { type: [String], required: true },
    bus_no: { type: String, required: false, default: undefined },
    amenities_list: { type: [String], required: true },
    busFare: { type: Number, required: true },
    busName: { type: String, required: true },
  });

const Trip = mongoose.model('Trip',tripSchema);
module.exports = Trip;  