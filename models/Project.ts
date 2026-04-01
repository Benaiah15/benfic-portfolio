import mongoose, { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  
  // --- NEW OPTIONAL FIELDS ---
  processText: { type: String },
  processImage1: { type: String }, // Stored as Base64 strings
  processImage2: { type: String },
  liveLink: { type: String },
  
  createdAt: { type: Date, default: Date.now },
});

const Project = models.Project || model("Project", ProjectSchema);

export default Project;