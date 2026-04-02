import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import Profile from "../../../models/Profile";

export async function GET() {
  try {
    await connectToDatabase();
    const profile = await Profile.findOne({});
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    // Body now contains bioExcerpt and fullBio
    const profile = await Profile.findOneAndUpdate({}, body, { upsert: true, new: true });
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
  }
}