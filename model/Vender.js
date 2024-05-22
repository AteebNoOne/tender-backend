import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { TOKEN_KEY } from "../config/index.js";

const Schema = mongoose.Schema;

const GalleryItemSchema = new Schema({
  publicId: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const venderSchema = new Schema({
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
  password: {
    type: String,
    required: [true, "Please Enter Password"],

  },
  otp: {
    type: String,
    
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
    type: String,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ["pending", "active"],
    default: "pending", // You can set a default value
  },
  likedVendors: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  dislikedVendors: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  address:{
    type: String,
    default:null
  },
  ratings:[
    {
      id:{type:Number},
      by:{type:String},
      createdAt:{type:Date},
      stars:{type:Number}
    }
  ]
});


venderSchema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, TOKEN_KEY, {
    expiresIn: "15d",
  });
};


export const Vender = mongoose.model("Vender", venderSchema);
