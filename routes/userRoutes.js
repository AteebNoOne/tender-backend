import express from "express";
import { uploadImage , registerUser, registerVender, login, forgetPassword, createCategory , getCategory, sendEmail, VerifyOtp, uploadVideo, getAllVenders, bookVenders, myBooking, venderBooking, likeVender, DislikeVender, updateVendorStatus, updateUserProfile, getLikedVendors} from "../controller/userController.js";
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.route("/registerUser").post(registerUser);
router.route("/registerVender").post(registerVender);
router.route("/login").post(login);
router.route("/forgetPassword").post(forgetPassword);
router.route("/createCategory").post(createCategory);
router.route("/getCategory").get(getCategory);
router.route("/sendEmail").post(sendEmail);
router.route("/getAllVenders").get(getAllVenders);
router.route("/verifyOtp").post(VerifyOtp);
router.route("/myBooking/:id").post(myBooking);
router.route("/likeVender/:vendorId").post(likeVender);
router.route("/updateVendorStatus/:vendorId").post(updateVendorStatus);
router.route("/dislikeVender/:vendorId").post(DislikeVender);
router.route("/updateUserProfile/:userId").post(updateUserProfile);
router.route("/updateVendorStatus/:vendorId").post(updateVendorStatus);
router.route("/venderBooking/:id").post(venderBooking);
router.route("/bookVenders").post(bookVenders);
router.route("/uploadImage" , upload.array('avatars')).post(uploadImage);
router.route("/uploadVideo").post(uploadVideo);
router.route("/getLikedVendors/:userId").post(getLikedVendors);


export default router;
