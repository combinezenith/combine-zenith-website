import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

// Load credentials from JSON key file
const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: "nextjs-analytics-service.json",
});

export async function GET() {
  try {
    // Replace with your GA4 property ID (e.g. "properties/123456789")
    const propertyId = "properties/509697900";

    const [response] = await analyticsDataClient.runReport({
      property: propertyId,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      metrics: [
        { name: "totalUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
      ],
      dimensions: [{ name: "date" }],
    });

    const data = response.rows?.map((row) => ({
      date: row.dimensionValues?.[0]?.value,
      users: row.metricValues?.[0]?.value,
      sessions: row.metricValues?.[1]?.value,
      pageViews: row.metricValues?.[2]?.value,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GA API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
