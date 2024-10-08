const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  place: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Place" },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  totalPrice: Number,
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
});

const BookingModel = mongoose.model("Booking", BookingSchema);
module.exports = BookingModel;
