import mongoose from "mongoose";

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: "Vender",
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  time:{
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "canceled"],
    default: "pending",
  },
});

export const Booking = mongoose.model("Booking", bookingSchema);
