import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import Visitor from "../../../models/Visitor";
import { UAParser } from "ua-parser-js"; // We need this package for device detection

// POST: Log a new visit (with improvised country/device detection)
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    // Country detection (requires deployment on Vercel to work)
    const country = req.headers.get("x-vercel-ip-country") || "Unknown";
    
    // User-Agent parsing for device type
    const userAgent = req.headers.get("user-agent");
    const parser = new UAParser(userAgent || "");
    const deviceType = parser.getDevice().type || "Desktop"; // Default to desktop if null

    await Visitor.create({ country, deviceType }); 
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to log visit" }, { status: 500 });
  }
}

// GET: Fetch visitors AND dynamic chart data (with improvised dynamic toggle)
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    // Parse timeframe from query params (default 7)
    const { searchParams } = new URL(req.url);
    const timeframeDays = parseInt(searchParams.get("timeframe") || "7"); // last 7, 30, 90, 180, 365

    const totalVisitors = await Visitor.countDocuments();

    // Calculate the date X days ago
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeframeDays);

    // Fetch only visitors from the requested timeframe
    const recentVisitors = await Visitor.find({
      visitedAt: { $gte: startDate }
    });

    // Dynamic Chart Counting Logic (Mon/Tue for 7D, date strings for longer ranges)
    const dailyCounts: { [key: string]: number } = {};
    for (let i = timeframeDays - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        // Default short weekday name (Mon) for last 7, else date string (MM/DD)
        const dateString = timeframeDays <= 30 
          ? d.toLocaleDateString('en-US', { weekday: 'short' }) 
          : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dailyCounts[dateString] = 0;
    }

    recentVisitors.forEach(v => {
       const dateString = timeframeDays <= 30
          ? new Date(v.visitedAt).toLocaleDateString('en-US', { weekday: 'short' })
          : new Date(v.visitedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
       if (dailyCounts[dateString] !== undefined) {
           dailyCounts[dateString]++;
       }
    });

    const chartData = Object.keys(dailyCounts).map(date => ({
        name: date,
        visitors: dailyCounts[date]
    }));

    // Fetch traffic details (Country/Device) Aggregation pipeline required
    const countryStats = await Visitor.aggregate([
      { $match: { visitedAt: { $gte: startDate } } },
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 } // Top 5
    ]);
    const deviceStats = await Visitor.aggregate([
        { $match: { visitedAt: { $gte: startDate } } },
        { $group: { _id: "$deviceType", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    return NextResponse.json({ 
        success: true, 
        total: totalVisitors, 
        chartData,
        trafficDetails: {
            countries: countryStats,
            devices: deviceStats
        }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 });
  }
}