import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  logo: [
    {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  ],
});

// module.exports = mongoose.model("Category", categorySchema);
export const Category = mongoose.model("Category", categorySchema);

