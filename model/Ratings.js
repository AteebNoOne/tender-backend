import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ratingSchema = new Schema({
    venderId: {
        type: Schema.Types.ObjectId,
        ref: "Vender",
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    bookingId: {
        type: Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },
    stars: {
        type: Number,
        default: 5,
        min: 1,
        max: 5,
    },
    comment: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export const Ratings = mongoose.model("Ratings", ratingSchema);
