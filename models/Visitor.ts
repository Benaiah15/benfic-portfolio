import mongoose, { Schema, model, models } from "mongoose";

const VisitorSchema = new Schema({
  visitedAt: { type: Date, default: Date.now },
  country: { type: String, default: "Unknown" }, // Stored during POST
  deviceType: { type: String, default: "Unknown" }, // Stored during POST (Mobile, Tablet, Desktop)
});

const Visitor = models.Visitor || model("Visitor", VisitorSchema);
export default Visitor;