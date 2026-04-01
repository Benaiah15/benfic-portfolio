import mongoose, { Schema, model, models } from "mongoose";

const VisitorSchema = new Schema({
  visitedAt: { type: Date, default: Date.now },
});

const Visitor = models.Visitor || model("Visitor", VisitorSchema);

export default Visitor;