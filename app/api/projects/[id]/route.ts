import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import Project from "../../../../models/Project";

// DELETE: Remove a project
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params; 
    await connectToDatabase();
    
    await Project.findByIdAndDelete(resolvedParams.id);
    
    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete project" }, { status: 500 });
  }
}

// PUT: Edit/Update an existing project
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await connectToDatabase();
    
    const body = await req.json();
    
    const updatedProject = await Project.findByIdAndUpdate(resolvedParams.id, body, { new: true });
    
    return NextResponse.json({ success: true, data: updatedProject });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update project" }, { status: 500 });
  }
}