import mongoose, { Schema, model, models } from "mongoose";

const ProfileSchema = new Schema({
  name: { type: String, default: "Benaiah Ajibade" },
  bio: { type: String },
  profileImageUrl: { type: String }, 
  updatedAt: { type: Date, default: Date.now },
});

const Profile = models.Profile || model("Profile", ProfileSchema);
export default Profile;