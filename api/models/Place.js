const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
  // owner will be filled automaticly by mongoose
  owner: { type: mongoose.Schema.ObjectId, ref: "User" },
  title: String,
  address: String,
  addedPhotos: [String],
  description: String,
  perks: [String],
  extraInfo: String,
  checkIn: Number,
  checkOut: Number,
  maxGuests: Number,
  price: Number,
});

const PlaceModel = new mongoose.model("Place", PlaceSchema);

module.exports = PlaceModel;
