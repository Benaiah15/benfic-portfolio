import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb"; // Adjust path if necessary
import Project from "../../../models/Project";

// POST: Upload a new project
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    // Parse the data sent from the dashboard
    const body = await req.json();
    
    // Create the new project in MongoDB
    const newProject = await Project.create(body);
    
    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
  } catch (error) {
    console.error("Failed to save project:", error);
    return NextResponse.json({ success: false, error: "Failed to save project" }, { status: 500 });
  }
}

// GET: Fetch all projects (we will use this for your public portfolio page)
export async function GET() {
  try {
    await connectToDatabase();
    
    // Find all projects and sort them by newest first
    const projects = await Project.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch projects" }, { status: 500 });
  }
}