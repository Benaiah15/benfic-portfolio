import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import Visitor from "../../../models/Visitor";
import { UAParser } from "ua-parser-js"; 

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const country = req.headers.get("x-vercel-ip-country") || "Unknown";
    const userAgent = req.headers.get("user-agent");
    const parser = new UAParser(userAgent || "");
    const deviceType = parser.getDevice().type || "Desktop";

    await Visitor.create({ country, deviceType }); 
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to log visit" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const timeframeDays = parseInt(searchParams.get("timeframe") || "7");

    // RESET FIX: Only fetch visitors that have the new tracking data (Not "Unknown")
    const baseFilter = { country: { $exists: true, $ne: "Unknown" } };
    
    const totalVisitors = await Visitor.countDocuments(baseFilter);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeframeDays);

    const recentVisitors = await Visitor.find({
      ...baseFilter,
      visitedAt: { $gte: startDate }
    });

    const dailyCounts: { [key: string]: number } = {};
    for (let i = timeframeDays - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
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

    const chartData = Object.keys(dailyCounts).map(date => ({ name: date, visitors: dailyCounts[date] }));

    const countryStats = await Visitor.aggregate([
      { $match: { ...baseFilter, visitedAt: { $gte: startDate } } },
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    const deviceStats = await Visitor.aggregate([
        { $match: { ...baseFilter, visitedAt: { $gte: startDate } } },
        { $group: { _id: "$deviceType", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    return NextResponse.json({ success: true, total: totalVisitors, chartData, trafficDetails: { countries: countryStats, devices: deviceStats } });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 });
  }
}