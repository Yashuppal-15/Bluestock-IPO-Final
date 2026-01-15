import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const ipos = await prisma.iPO.findMany({
      include: {
        company: {
          select: {
            id: true,
            name: true,
            symbol: true,  // ← ADD THIS LINE
            logo: true
          }
        }
      }
    });

    // CSV Headers
    const headers = [
      "Company Name",
      "Symbol",
      "Price Band",
      "Issue Type",
      "Issue Size",
      "Open Date",
      "Close Date",
      "Status",
      "IPO Price",
      "Listing Price",
      "Listing Gain",
      "Current Return"
    ];

    // CSV Rows
    const rows = ipos.map((ipo) => [
      ipo.company.name,
      ipo.company.symbol || "N/A",
      ipo.priceBand,
      ipo.issueType,
      ipo.issueSize,
      new Date(ipo.openDate).toLocaleDateString(),
      new Date(ipo.closeDate).toLocaleDateString(),
      ipo.status,
      ipo.ipoPrice?.toString() || "N/A",
      ipo.listingPrice?.toString() || "N/A",
      ipo.listingGain?.toString() || "N/A",
      ipo.currentReturn?.toString() || "N/A"
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => `"${cell}"`)
          .join(",")
      )
    ].join("\n");

    // Set headers and send
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=ipos.csv"
    );
    res.status(200).send(csvContent);
  } catch (error) {
    console.error("CSV Export Error:", error);
    res.status(500).json({ error: "Failed to export CSV" });
  }
}
