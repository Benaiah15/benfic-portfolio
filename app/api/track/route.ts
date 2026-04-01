import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import Visitor from "../../../models/Visitor";

// POST: Log a new visit
export async function POST() {
  try {
    await connectToDatabase();
    await Visitor.create({}); 
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to log visit" }, { status: 500 });
  }
}

// GET: Fetch total visitors AND the last 7 days chart data
export async function GET() {
  try {
    await connectToDatabase();
    const totalVisitors = await Visitor.countDocuments();

    // Calculate the date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Fetch only visitors from the last 7 days
    const recentVisitors = await Visitor.find({
      visitedAt: { $gte: sevenDaysAgo }
    });

    // Create an object to hold the last 7 days initialized to 0
    const dailyCounts: { [key: string]: number } = {};
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        // Format as short weekday name (e.g., "Mon", "Tue")
        const dateString = d.toLocaleDateString('en-US', { weekday: 'short' }); 
        dailyCounts[dateString] = 0;
    }

    // Count the visitors for each day
    recentVisitors.forEach(v => {
       const dateString = new Date(v.visitedAt).toLocaleDateString('en-US', { weekday: 'short' });
       if (dailyCounts[dateString] !== undefined) {
           dailyCounts[dateString]++;
       }
    });

    // Convert the object into an array format that Recharts can read
    const chartData = Object.keys(dailyCounts).map(date => ({
        name: date,
        visitors: dailyCounts[date]
    }));

    return NextResponse.json({ success: true, total: totalVisitors, chartData });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 });
  }
}