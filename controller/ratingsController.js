import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Ratings } from "../model/Ratings.js";
import { Booking } from "../model/Booking.js";
import { Vender } from "../model/Vender.js";

export const createRating = catchAsyncError(async (req, res, next) => {
    const { bookingId, stars, comment } = req.body;

    if (!bookingId) return next(new ErrorHandler("Booking ID Required", 400));
    const allRatings = await Ratings.find({ bookingId })
    console.log(allRatings)
    if (allRatings.length > 0) {
        return next(new ErrorHandler("Booking is already rated", 400));
    }

    const booking = await Booking.findById(bookingId)
    const venderId = booking.vendor;
    const userId = booking.user;

    const rating = new Ratings({
        venderId,
        userId,
        bookingId,
        stars,
        comment,
    });

    const vender = await Vender.findById(venderId)
    vender.ratings.push(rating._id)
    booking.rating = rating;
    booking.status = "reviewed"
    try {
        await rating.save();
        await vender.save();
        await booking.save()

        res.status(201).json({
            success: true,
            message: "Rating created successfully",
            rating
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});


export const getAllRatings = catchAsyncError(async (req, res, next) => {
    try {
        // Fetch all ratings
        const ratings = await Booking.find();  // Added 'await' to ensure ratings are fetched before responding

        // Respond with success
        res.status(200).json({
            success: true,
            message: "Ratings retrieved successfully",
            ratings  // Fixed variable name from 'rating' to 'ratings'
        });
    } catch (error) {
        // Handle errors
        next(new ErrorHandler(error.message, 500));
    }
});