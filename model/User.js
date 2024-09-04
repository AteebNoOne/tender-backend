import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { TOKEN_KEY } from "../config/index.js";

const Schema = mongoose.Schema;


const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please Enter Your Name"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  phoneNumber: {
    type: Number,
    required: [true, "Please Enter Number"],
    unique: true

  },
  otp: {
    type: String,
    
  },
  password: {
    type: String,
    required: [true, "Please Enter Password"],

  },
  email: {
    type: String,
    required: [true, "Please Enter Email"],
    unique: true
  },
  type: {
    type: String,
    enum: ['customer', 'vendor'],
    required: true
  },
  category: {
    type: String
  },
  image: {
    type: String
  }
});


userSchema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, TOKEN_KEY, {
    expiresIn: "15d",
  });
};


export const User = mongoose.model("User", userSchema);
