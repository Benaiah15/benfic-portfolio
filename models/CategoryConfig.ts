import mongoose, { Schema, model, models } from "mongoose";

const CategoryConfigSchema = new Schema({
  categoryName: { 
    type: String, 
    required: true, 
    unique: true, 
    enum: ["Web Development", "Wordpress Development", "UI/UX Design", "Graphic Design"] 
  },
  
  featuredImageUrl: { type: String, required: true }, // Base64
  shortDescription: { type: String, required: true }, // Appears on main Portfolio page
  updatedAt: { type: Date, default: Date.now },
});

const CategoryConfig = models.CategoryConfig || model("CategoryConfig", CategoryConfigSchema);
export default CategoryConfig;