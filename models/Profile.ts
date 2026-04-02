import mongoose, { Schema, model, models } from "mongoose";

const ProfileSchema = new Schema({
  name: { type: String, default: "Benaiah Ajibade" },
  
  // Excerpt for home page (Read More)
  bioExcerpt: { type: String, default: "I am a multi-disciplinary creative specialist dedicated to bridging the gap between visual design and technical execution. I generate designs that speak louder than words and sell your services effectively..." },
  
  // Full description for About Page
  fullBio: { type: String, default: "Benaiah Ajibade isn't just a designer; I'm a creative strategist focused on converting pixels into profit. I offer high-performance creative services that combine modern graphics design, Web Development (using tools like Next.js and Tailwind), and optimized WordPress Development. My philosophy is to push boundaries, ensuring every solution is performant, beautiful, and user-centric..." },
  
  profileImageUrl: { type: String }, // Base64
  updatedAt: { type: Date, default: Date.now },
});

const Profile = models.Profile || model("Profile", ProfileSchema);
export default Profile;