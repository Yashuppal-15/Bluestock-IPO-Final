import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch all IPOs
    const allIPOs = await prisma.iPO.findMany({
      include: { company: true },
    });

    // Calculate stats
    const totalIPOs = allIPOs.length;
    const upcomingIPOs = allIPOs.filter((ipo) => ipo.status === "UPCOMING")
      .length;
    const openIPOs = allIPOs.filter((ipo) => ipo.status === "OPEN").length;
    const listedIPOs = allIPOs.filter((ipo) => ipo.status === "LISTED").length;

    const listedWithGain = allIPOs.filter(
      (ipo) => ipo.status === "LISTED" && ipo.listingGain !== null
    );
    const averageListingGain =
      listedWithGain.length > 0
        ? listedWithGain.reduce(
            (sum, ipo) => sum + (ipo.listingGain || 0),
            0
          ) / listedWithGain.length
        : 0;

    // Calculate total issue size
    const totalIssueSizeStr = allIPOs
      .reduce((sum, ipo) => {
        const numStr = ipo.issueSize?.replace(/[^\d]/g, "") || "0";
        return sum + parseInt(numStr);
      }, 0)
      .toString();

    // Status breakdown
    const statusBreakdown = [
      {
        status: "UPCOMING",
        count: upcomingIPOs,
      },
      {
        status: "OPEN",
        count: openIPOs,
      },
      {
        status: "CLOSED",
        count: allIPOs.filter((ipo) => ipo.status === "CLOSED").length,
      },
      {
        status: "LISTED",
        count: listedIPOs,
      },
    ];

    const stats = {
      totalIPOs,
      upcomingIPOs,
      openIPOs,
      listedIPOs,
      averageListingGain,
      totalIssueSize: totalIssueSizeStr,
    };

    const chartData = {
      statusBreakdown,
    };

    res.status(200).json({ stats, chartData });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
}
