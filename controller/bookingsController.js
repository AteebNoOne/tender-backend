import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Booking } from "../model/Booking.js";

export const ChangeBookingStatus = catchAsyncError(async (req, res, next) => {
  const { bookingId, status } = req.body;

  if (!bookingId) return next(new ErrorHandler("Booking ID Not Found", 409));
  if (!status) return next(new ErrorHandler("Status Not Found", 409));

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) return next(new ErrorHandler("Booking not found", 404));

    if(status === "canceled" && booking.status !== "pending" ){
      return next(new ErrorHandler("Status already changed", 404));
    }
    if(status === "confirmed" && booking.status === "canceled" ){
      return next(new ErrorHandler("Status already changed", 404));
    }
    if(status === "rejected" && booking.status === "canceled" ){
      return next(new ErrorHandler("Status already changed", 404));
    }
    booking.status = status;
    await booking.save();

    res.status(200).json({ success: true, message: "Booking status updated successfully", booking });
  } catch (error) {
    return next(new ErrorHandler(error.message || "Internal Server Error", 500));
  }
});
