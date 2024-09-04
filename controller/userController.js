import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { User } from "../model/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendToken } from "../utils/sendToken.js";
import cloudinary from "cloudinary";
import multer from "multer";
import { Vender } from "../model/Vender.js";
import { Category } from "../model/Category.js";
import nodemailer from "nodemailer";
import { Booking } from "../model/Booking.js";

const upload = multer({ dest: "uploads/" });
export const uploadVideos = upload.single("video");

cloudinary.v2.config({
  cloud_name: "ddu4sybue",
  api_key: "658491673268817",
  api_secret: "w35Ei6uCvbOcaN4moWBKL3BmW4Q",
});

// Register User
export const registerUser = catchAsyncError(async (req, res, next) => {
  const { username, password, email, type, phoneNumber, image } = req.body;
  if (!username) return next(new ErrorHandler("Please Add Name", 409));
  if (!password) return next(new ErrorHandler("Please Add Password", 409));
  if (!email) return next(new ErrorHandler("Please Add Email", 409));
  if (!type) return next(new ErrorHandler("Please Add Type", 409));
  if (!image) return next(new ErrorHandler("Please Add Image", 409));
  if (!phoneNumber)
    return next(new ErrorHandler("Please Add Phone Number", 409));
  const existingUser = await User.findOne({
    $or: [{ phone: phoneNumber }, { email }],
  });
  if (existingUser) return next(new ErrorHandler("User Already Exist", 409));

  const user = new User({
    username,
    password,
    email,
    phoneNumber,
    type,
    image,
  });
  await user.save();
  sendToken(res, user, "User Register", 201);
});
// Register Vender
export const registerVender = catchAsyncError(async (req, res, next) => {
  const {
    username,
    password,
    email,
    type,
    phoneNumber,
    category,
    image,
    description,
  } = req.body;
  if (!username) return next(new ErrorHandler("Please Add Name", 409));
  if (!password) return next(new ErrorHandler("Please Add Password", 409));
  if (!email) return next(new ErrorHandler("Please Add Email", 409));
  if (!type) return next(new ErrorHandler("Please Add Type", 409));
  if (!image) return next(new ErrorHandler("Please Add Image", 409));
  if (!description)
    return next(new ErrorHandler("Please Add Description", 409));
  if (!phoneNumber)
    return next(new ErrorHandler("Please Add Phone Number", 409));
  const existingUser = await Vender.findOne({
    $or: [{ phone: phoneNumber }, { email }],
  });
  if (existingUser) return next(new ErrorHandler("Vender Already Exist", 409));

  const vendor = new Vender({
    username,
    password,
    email,
    phoneNumber,
    type,
    category,
    image,
    description,
  });
  await vendor.save();
  sendToken(res, vendor, "Vender Register", 201);
});


// Delete User or Vender
export const deleteUserOrVender = catchAsyncError(async (req, res, next) => {
  const { _id, type } = req.body;

  if (!type || !_id) {
    return next(new ErrorHandler("Invalid request. Please provide valid _id and type.", 400));
  }

  try {
    if (type === 'user') {
      await User.findOneAndDelete({ _id });
      res.status(200).json({ success: true, message: 'User deleted successfully.' });
    } else if (type === 'vendor') {
      await Vender.findOneAndDelete({ _id });
      res.status(200).json({ success: true, message: 'Vender deleted successfully.' });
    } else {
      return next(new ErrorHandler("Invalid type. Please provide either 'user' or 'vender'.", 400));
    }
  } catch (error) {
    return next(new ErrorHandler("Error deleting user or vender.", 500));
  }
});

// Login User
export const login = catchAsyncError(async (req, res, next) => {
  const { password, email, type } = req.body;
  if (!type) return next(new ErrorHandler("Please Add Type", 409));
  if (!password) return next(new ErrorHandler("Please Add Password", 409));
  if (!email) return next(new ErrorHandler("Please Add Email", 409));

  if (type === "customer") {
    const existingUser = await User.findOne({ email });
    if (!existingUser) return next(new ErrorHandler("User Not Found", 409));
    if (existingUser.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }
    sendToken(res, existingUser, "User Login", 201);
  } else {
    const existingUser = await Vender.findOne({ email });
    if (!existingUser) return next(new ErrorHandler("Vender Not Found", 409));
    if (existingUser.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }
    sendToken(res, existingUser, "Vender Login", 201);
  }
});

// Forget Password
export const forgetPassword = catchAsyncError(async (req, res, next) => {
  const { newPassword, email, type } = req.body;
  if (!type) return next(new ErrorHandler("Please Add Type", 409));
  if (!newPassword) return next(new ErrorHandler("Please Add Password", 409));
  if (!email) return next(new ErrorHandler("Please Add Email", 409));

  if (type === "customer") {
    const existingUser = await User.findOne({ email });
    if (!existingUser) return next(new ErrorHandler("User Not Found", 409));
    existingUser.password = newPassword;
    sendToken(res, existingUser, "Password Change Successfully", 201);
  } else {
    const existingUser = await Vender.findOne({ email });
    if (!existingUser) return next(new ErrorHandler("Vender Not Found", 409));
    existingUser.password = newPassword;
    sendToken(res, existingUser, "Password Change Successfully", 201);
  }
});

// Add User Images
export const uploadImage = async (req, res, next) => {
  let images = [];
  if (req.files && req.files.avatars) {
    if (!Array.isArray(req.files.avatars)) {
      images.push(req.files.avatars);
    } else {
      images = req.files.avatars;
    }
  }
  let responce = [];
  for (const image of images) {
    try {
      const result = await cloudinary.v2.uploader.upload(image.tempFilePath);
      const publidId = result.public_id;
      const url = result.url;
      let data = {
        publidId,
        url,
      };
      responce.push(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error uploading images" });
    }
  }
  res.send(responce);
};

// Add User Video
export const uploadVideo = async (req, res, next) => {
  if (!req.files || !req.files.video) {
    return res.status(400).json({ error: "No video file provided" });
  }

  let responce = [];

  try {
    const videoFile = req.files.video;
    const result = await cloudinary.v2.uploader.upload(videoFile.tempFilePath, {
      resource_type: "video",
    });
    const publidId = result.public_id;
    const url = result.url;
    let data = {
      publidId,
      url,
    };
    responce.push(data);
    res.send(responce);
  } catch (error) {
    return res.status(500).json({ error: "Error uploading video" });
  }
};

// Add Category
export const createCategory = async (req, res, next) => {
  const { title, logo } = req.body;

  try {
    const alreadyPresent = await Category.findOne({ title });
    if (alreadyPresent)
      return next(new ErrorHandler("Please Choose Unique Title", 409));
    const category = new Category({ title, logo });
    await category.save();

    return res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error("Error in creating category:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// Get Category
export const getCategory = async (req, res, next) => {
  try {
    const categories = await Category.find();

    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error("Error in fetching categories:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Send Email
export const sendEmail = async (req, res, next) => {
  const { email, type } = req.body;
  if (type === "customer") {
    const existingUser = await User.findOne({ email });
    if (!existingUser) return next(new ErrorHandler("User Not Found", 409));
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    existingUser.otp = verificationCode;
    await existingUser.save();

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: "ateebnoone@gmail.com", // generated ethereal user
        pass: "rofoiausvwsxouhi", // generated ethereal password
      },
    });

    let info = await transporter.sendMail({
      from: '"Verify Mail" <ateebnoone@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: verificationCode,
    });

    console.log("Message sent: %s", info.messageId);
    res.json({ info });
  } else {
    const existingUser = await Vender.findOne({ email });
    if (!existingUser) return next(new ErrorHandler("User Not Found", 409));
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    existingUser.otp = verificationCode;
    await existingUser.save();
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: "ateebnoone@gmail.com", // generated ethereal user
        pass: "rofoiausvwsxouhi", // generated ethereal password
      },
    });

    let info = await transporter.sendMail({
      from: '"Verify Mail" <ateebnoone@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: verificationCode,
    });

    console.log("Message sent: %s", info.messageId);
    res.json({ sucess: "true", data: info });
  }
};

// Verify Email
export const VerifyOtp = async (req, res, next) => {
  const { otp, type, email } = req.body;
  if (type === "customer") {
    const existingUser = await User.findOne({ email });
    if (!existingUser) return next(new ErrorHandler("User Not Found", 409));
    if (existingUser.otp === otp) {
      existingUser.otp = null;
      await existingUser.save();
      res.status(200).json({
        success: "true",
        message: "Match",
      });
    } else {
      res.status(400).json({
        success: "false",
        message: "Wrong Otp",
      });
    }
  } else {
    const existingUser = await Vender.findOne({ email });

    if (!existingUser) return next(new ErrorHandler("User Not Found", 409));
    if (existingUser.otp === otp) {
      existingUser.otp = null;
      await existingUser.save();
      res.status(200).json({
        success: "true",
        message: "Match",
      });
    } else {
      res.status(400).json({
        success: "false",
        message: "Wrong Otp",
      });
    }
  }
};

// Get All Venders
export const getAllVenders = async (req, res, next) => {
  try {
    const vendors = await Vender.find().populate({
      path: 'ratings',
      populate: {
        path: 'userId',
        model: 'User',
        select: '-password -__v', // Exclude fields you don't want to return from the user
      },
      select: '-venderId -__v', // Exclude venderId and __v from the ratings
    });
    res.status(200).json({ success: true, vendors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const getVender = async (req, res, next) => {
  const {venderId} = req.params;

  try {
    const vendor = await Vender.findById(venderId);

    res.status(200).json({ success: true, vendor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};


// Book Venders
export const bookVenders = async (req, res, next) => {
  const { userId, vendorId, service, bookingDate,time } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User or vendor not found" });
  }
  const vendor = await Vender.findById(vendorId);
  if (!vendor) {
    return res.status(404).json({ error: "User or vendor not found" });
  }

  // Create a new booking
  const newBooking = new Booking({
    user: userId,
    vendor: vendorId,
    service,
    bookingDate,
    time
  });
  await newBooking.save();
  res.status(201).json({ success: true, booking: newBooking });
};

// Book Venders
export const myBooking = async (req, res, next) => {
  const userId = req.params.id;
  if (!userId) {
    res.status(404).json({ success: false });

  }

  // Fetch bookings associated with the user
  const bookings = await Booking.find({ user: userId }).populate("vendor").populate("rating")

  res.status(200).json({ success: true, bookings });
};

// Book Venders
export const venderBooking = async (req, res, next) => {
  const vendorId = req.params.id;
  if (vendorId === "undefined") {
    res.status(404).json({ success: false });
  }
  // Fetch bookings associated with the vendor
  try {
    const bookings = await Booking.find({ vendor: vendorId }).populate("user").populate("rating");
    res.status(200).json({ success: true, bookings });

  }
  catch (error) {
    console.error(error)
  }
};
// Toggle Like/Dislike Vendor
export const toggleLikeVender = async (req, res, next) => {
  const { vendorId } = req.params;
  const { userId } = req.body;

  try {
    // Find the vendor by ID
    const vender = await Vender.findById(vendorId);

    if (!vender) {
      return res.status(404).json({ success: false, error: "Vendor not found" });
    }

    // Check if the user has already liked this vendor
    const hasLiked = vender.likedVendors.includes(userId);

    if (hasLiked) {
      vender.likedVendors.pop(userId)
      await vender.save();
      return res.status(200).json({ success: true, message: "Vendor unliked successfully" });
    } else {
      // If the user has not liked, add the userId to the likedVendors array
      vender.likedVendors.push(userId);
      await vender.save();

      return res.status(200).json({ success: true, message: "Vendor liked successfully" });
    }
  } catch (error) {
    console.error("Error toggling like for vendor:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};


// Update Vender Status
export const updateVendorStatus = async (req, res, next) => {
  const { vendorId } = req.params;
  const { status } = req.body;

  try {
    // Find the vendor by ID
    const vendor = await Vender.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    // Update the vendor's status
    vendor.status = status;
    const newData = await vendor.save();

    return res
      .status(200)
      .json({ success: true, message: "Vendor status updated successfully", newData });
  } catch (error) {
    console.error("Error updating vendor status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Update User Profile
export const updateUserProfile = async (req, res, next) => {
  const { userId } = req.params;
  const { email, username, phoneNumber, image } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);


    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's profile fields
    if (email) {
      user.email = email;
    }
    if (username) {
      user.username = username;
    }
    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }
    if (image) {
      user.image = image;
    }

    const newData = await user.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "User profile updated successfully",
        newData,
      });
  } catch (error) {
    console.error("Error updating user profile:", error);
  // Convert the error to a string or check the message property
  if (error.message && error.message.includes("phoneNumber_1 dup key")) {
    return res.status(400).json({   success: false,message: "Phone number already in use" });
  }
  if (error.message && error.message.includes("email_1 dup key")) {
    return res.status(400).json({   success: false,message: "Email already in use" });
  }
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Update Vendor Profile
export const updateVendorProfile = async (req, res, next) => {
  const { vendorId } = req.params; 
  const { email, username, phoneNumber, image, description, category } = req.body;

  try {
    // Find the vendor by ID
    const vendor = await Vender.findById(vendorId); 
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    // Update the vendor's profile fields
    if (email) {
      vendor.email = email;
    }
    if (username) {
      vendor.username = username;
    }
    if (phoneNumber) {
      vendor.phoneNumber = phoneNumber;
    }
    if (image) {
      vendor.image = image;
    }
    if (description) {
      vendor.description = description;
    }
    if (category) {
      vendor.category = category;
    }

    const newData = await vendor.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "Vendor profile updated successfully",
        newData,
      });
  } catch (error) {
    console.error("Error updating vendor profile:", error);
  // Convert the error to a string or check the message property
  if (error.message && error.message.includes("phoneNumber_1 dup key")) {
    return res.status(400).json({   success: false,message: "Phone number already in use" });
  }
  if (error.message && error.message.includes("email_1 dup key")) {
    return res.status(400).json({   success: false,message: "Email already in use" });
  }
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get All Liked Vendors
export const getLikedVendors = async (req, res, next) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Get the user's liked vendors
    const likedVendors = await Vender.find({ _id: { $in: user.likedVendors } });

    res.status(200).json({ success: true, data: likedVendors });
  } catch (error) {
    console.error("Error getting liked vendors:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};


// Get All Liked Vendors
export const deleteAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.deleteMany();

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error getting bookings:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
