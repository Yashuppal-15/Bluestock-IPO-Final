import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get all IPOs with full company data
    const ipos = await prisma.iPO.findMany({
      include: {
        company: true  // ← Get ALL company fields including symbol
      },
      orderBy: {
        createdAt: "desc"
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
    const rows = ipos.map((ipo) => {
      const company = ipo.company as any;
      return [
        company.name || "N/A",
        company.symbol || "N/A",
        ipo.priceBand || "N/A",
        ipo.issueType || "N/A",
        ipo.issueSize || "N/A",
        ipo.openDate ? new Date(ipo.openDate).toLocaleDateString() : "N/A",
        ipo.closeDate ? new Date(ipo.closeDate).toLocaleDateString() : "N/A",
        ipo.status || "N/A",
        ipo.ipoPrice?.toString() || "N/A",
        ipo.listingPrice?.toString() || "N/A",
        ipo.listingGain?.toString() || "N/A",
        ipo.currentReturn?.toString() || "N/A"
      ];
    });

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            // Escape quotes and wrap in quotes if contains comma
            const str = String(cell).replace(/"/g, '""');
            return `"${str}"`;
          })
          .join(",")
      )
    ].join("\n");

    // Set response headers
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="ipos-export.csv"'
    );
    
    // Send CSV
    res.status(200).send(csvContent);
  } catch (error) {
    console.error("CSV Export Error:", error);
    res.status(500).json({ error: "Failed to export CSV" });
  }
}
