// app/api/analytics/route.ts
import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

function getDateRange(range: string | null) {
  switch (range) {
    case "today":
      return [{ startDate: "today", endDate: "today" }];
    case "30days":
      return [{ startDate: "30daysAgo", endDate: "today" }];
    case "7days":
    default:
      return [{ startDate: "7daysAgo", endDate: "today" }];
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const range = url.searchParams.get("range") || "7days"; // today | 7days | 30days
    const propertyId = `properties/${process.env.GA_PROPERTY_ID}`;

    // ---------- Historical  (runReport) ----------
    const dateRanges = getDateRange(range);

    const [historicalResponse] = await analyticsDataClient.runReport({
      property: propertyId,
      dateRanges,
      metrics: [
        { name: "totalUsers" },
        { name: "newUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "engagedSessions" },
      ],
      dimensions: [{ name: "date" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    });

    const historicalData =
      historicalResponse.rows?.map((row) => ({
        date: row.dimensionValues?.[0]?.value || "",
        totalUsers: Number(row.metricValues?.[0]?.value || 0),
        newUsers: Number(row.metricValues?.[1]?.value || 0),
        sessions: Number(row.metricValues?.[2]?.value || 0),
        pageViews: Number(row.metricValues?.[3]?.value || 0),
        engagedSessions: Number(row.metricValues?.[4]?.value || 0),
      })) || [];

    // ---------- Traffic sources (aggregate by sessionDefaultChannelGroup) ----------
    // Using runReport grouped by channel
    const [trafficResp] = await analyticsDataClient.runReport({
      property: propertyId,
      dateRanges,
      metrics: [{ name: "sessions" }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      // limit not directly supported here; we'll slice on client
    });

    const trafficSources =
      trafficResp.rows
        ?.map((r) => ({
          name: r.dimensionValues?.[0]?.value || "Unknown",
          value: Number(r.metricValues?.[0]?.value || 0),
        }))
        ?.slice(0, 8) || [];

    // ---------- Top pages (pagePath by screenPageViews) ----------
    const [pagesResp] = await analyticsDataClient.runReport({
      property: propertyId,
      dateRanges,
      metrics: [{ name: "screenPageViews" }],
      dimensions: [{ name: "pagePath" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    });

    const topPages =
      pagesResp.rows
        ?.map((r) => ({
          path: r.dimensionValues?.[0]?.value || "",
          views: Number(r.metricValues?.[0]?.value || 0),
        }))
        ?.slice(0, 10) || [];

    // ---------- Geo (country) ----------
    const [geoResp] = await analyticsDataClient.runReport({
      property: propertyId,
      dateRanges,
      metrics: [{ name: "totalUsers" }],
      dimensions: [{ name: "country" }],
      orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
    });

    const geo =
      geoResp.rows
        ?.map((r) => ({
          country: r.dimensionValues?.[0]?.value || "Unknown",
          users: Number(r.metricValues?.[0]?.value || 0),
        }))
        ?.slice(0, 10) || [];

    // ---------- Device category ----------
    const [deviceResp] = await analyticsDataClient.runReport({
      property: propertyId,
      dateRanges,
      metrics: [{ name: "totalUsers" }],
      dimensions: [{ name: "deviceCategory" }],
      orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
    });

    const devices =
      deviceResp.rows?.map((r) => ({
        device: r.dimensionValues?.[0]?.value || "Unknown",
        users: Number(r.metricValues?.[0]?.value || 0),
      })) || [];

    // ---------- Realtime active users (runRealtimeReport) ----------
    const [realtimeResp] = await analyticsDataClient.runRealtimeReport({
      property: propertyId,
      metrics: [{ name: "activeUsers" }],
      // optional dimension: pagePath to see which pages are active
    });

    const realtimeActiveUsers =
      realtimeResp.rows?.reduce(
        (sum, row) => sum + Number(row.metricValues?.[0]?.value || 0),
        0
      ) || 0;

    return NextResponse.json({
      success: true,
      range,
      historicalData,
      realtimeActiveUsers,
      trafficSources,
      topPages,
      geo,
      devices,
      totalRows: historicalData.length,
    });
  } catch (error) {
    console.error("🔥 GA API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch analytics data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
