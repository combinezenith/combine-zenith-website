import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
  },
});

export async function GET() {
  try {
    const propertyId = process.env.GA_PROPERTY_ID; // your GA4 property ID

    const [response] = await analyticsDataClient.runReport({
      property: propertyId,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      metrics: [
        { name: "totalUsers" },
        { name: "newUsers" },
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "engagedSessions" },
        { name: "bounceRate" },
        { name: "averageSessionDuration" },
      ],
      dimensions: [{ name: "date" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    });

    const data = response.rows?.map((row) => ({
      date: row.dimensionValues?.[0]?.value,
      totalUsers: row.metricValues?.[0]?.value,
      newUsers: row.metricValues?.[1]?.value,
      activeUsers: row.metricValues?.[2]?.value,
      sessions: row.metricValues?.[3]?.value,
      pageViews: row.metricValues?.[4]?.value,
      engagedSessions: row.metricValues?.[5]?.value,
      bounceRate: parseFloat(row.metricValues?.[6]?.value || "0").toFixed(2),
      avgSessionDuration: parseFloat(
        row.metricValues?.[7]?.value || "0"
      ).toFixed(2),
    }));

    return NextResponse.json({ data, totalRows: data?.length || 0 });
  } catch (error) {
    console.error("🔥 GA API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch analytics data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
