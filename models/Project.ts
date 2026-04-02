import mongoose, { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  
  // Added Main Category (Web, Graphics, WP, UIUX) for dynamic page linking
  category: { 
    type: String, 
    required: true, 
    enum: ["Web Development", "Wordpress Development", "UI/UX Design", "Graphic Design"] 
  },
  
  description: { type: String, required: true }, // Main project description (laptop detail page)
  
  imageUrl: { type: String, required: true }, // Main feature image
  
  liveLink: { type: String },
  problemSolved: { type: String }, // Case Study Problem (improvise)
  solutionText: { type: String },  // Case Study Solution (improvise)
  
  // --- Case Study Section with Resizing Support (Base64 list) ---
  // Any number of images that will be featuring any amount of process image 
  processBreakdown: { type: String }, // General process text
  processImages: { type: [String] }, // List of Base64 strings (resizable containers)

  // --- Dynamic Category Fields ---
  
  // WEB/WORDPRESS DEV Specific: Laptop, tablet, and mobile views
  viewLaptopImageUrl: { type: String }, // Base64
  viewTabletImageUrl: { type: String }, // Base64
  viewMobileImageUrl: { type: String }, // Base64
  
  // WEB Specific: Technologies used
  technologiesUsed: { type: [String] }, // ['React', 'Next.js', 'TailwindCSS']

  // WORDPRESS Specific: Themes and Plugins
  wpThemeUsed: { type: String },
  wpPluginsUsed: { type: [String] }, // ['WooCommerce', 'WP Rocket']

  // GRAPHIC DESIGN Specific: Togglable designs toggle Format
  graphicDesignType: { 
    type: String, 
    enum: ["My Brand Design", "My Social Media Design", "My Poster Design", "My Product Design", "Other Design"]
  },

  createdAt: { type: Date, default: Date.now },
});

const Project = models.Project || model("Project", ProjectSchema);
export default Project;