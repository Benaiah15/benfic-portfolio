import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import CategoryConfig from "../../../models/CategoryConfig";

export async function GET() {
  try {
    await connectToDatabase();
    const configs = await CategoryConfig.find({});
    return NextResponse.json({ success: true, data: configs });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch configs" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const configsArray = await req.json(); // Array of configs from dashboard

    // Process all updates as upserts
    await Promise.all(configsArray.map((config: any) => 
        CategoryConfig.findOneAndUpdate({ categoryName: config.categoryName }, config, { upsert: true, new: true })
    ));

    return NextResponse.json({ success: true, message: "Configs updated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
  }
}