import mongoose from "mongoose";
const placeSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Place must has a title"] },
  description: {
    type: String,
    required: [true, "Place must has a description"],
  },
  image: { type: String, required: [true, "Place must has a image"] },
  address: { type: String, required: [true, "Place must has a address"] },
  location: {
    lat: { type: String, required: [true, "location must has a lat"] },
    lon: { type: String, required: [true, "location must has a lng "] },
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});
const Place = mongoose.model.Place || mongoose.model("Place", placeSchema);
export default Place;
