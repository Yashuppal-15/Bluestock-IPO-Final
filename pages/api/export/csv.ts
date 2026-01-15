import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const ipos = await prisma.iPO.findMany({
      include: { company: true },
    });

    // Create CSV headers
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
      "Listing Gain %",
      "Current Return %",
    ];

    // Create CSV rows
    const rows = ipos.map((ipo) => [
      ipo.company.name,
      ipo.company.symbol || "N/A",  // ← ADD || "N/A"
      ipo.priceBand,
      ipo.issueType,
      ipo.issueSize,
      new Date(ipo.openDate).toLocaleDateString("en-IN"),
      new Date(ipo.closeDate).toLocaleDateString("en-IN"),
      ipo.status,
      ipo.ipoPrice || "N/A",
      ipo.listingPrice || "N/A",
      ipo.listingGain || "N/A",
      ipo.currentReturn || "N/A",
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="ipos-${new Date().toISOString().split("T")[0]}.csv"`
    );

    res.status(200).send(csvContent);
  } catch (error) {
    console.error("Error exporting CSV:", error);
    res.status(500).json({ error: "Failed to export CSV" });
  }
}
