import express from "express";
import { uploadImage , registerUser, registerVender, login, forgetPassword, createCategory , getCategory, sendEmail, VerifyOtp, uploadVideo, getAllVenders, bookVenders, myBooking, venderBooking, updateVendorStatus, updateUserProfile, getLikedVendors, toggleLikeVender, deleteUserOrVender, getVender, updateVendorProfile} from "../controller/userController.js";
import multer from 'multer';
import { ServerAndDatabaseHealth } from "./serverController.js";
const upload = multer({ dest: 'uploads/' });

const router = express.Router();
router.route("/health").get(ServerAndDatabaseHealth);

router.route("/registerUser").post(registerUser);
router.route("/registerVender").post(registerVender);
router.route("/login").post(login);
router.route("/forgetPassword").post(forgetPassword);
router.route("/createCategory").post(createCategory);
router.route("/getCategory").get(getCategory);
router.route("/sendEmail").post(sendEmail);
router.route("/getAllVenders").get(getAllVenders);
router.route("/getVender/:venderId").get(getVender);
router.route("/verifyOtp").post(VerifyOtp);
router.route("/myBooking/:id").post(myBooking);
router.route("/toggleLikeVender/:vendorId").post(toggleLikeVender);
router.route("/updateVendorStatus/:vendorId").post(updateVendorStatus);
router.route("/updateUserProfile/:userId").post(updateUserProfile);
router.route("/updateVenderProfile/:vendorId").post(updateVendorProfile);

router.route("/venderBooking/:id").post(venderBooking);
router.route("/bookVenders").post(bookVenders);
router.route("/uploadImage" , upload.array('avatars')).post(uploadImage);
router.route("/uploadVideo").post(uploadVideo);
router.route("/getLikedVendors/:userId").post(getLikedVendors);
router.route("/deleteUser").post(deleteUserOrVender);


export default router;
