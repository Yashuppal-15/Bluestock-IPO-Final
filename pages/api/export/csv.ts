import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const ipos = await prisma.iPO.findMany({
      include: {
        company: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const headers = [
      "Company Name",
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

    const rows = ipos.map((ipo) => [
      ipo.company?.name || "N/A",
      ipo.priceBand || "N/A",
      ipo.issueType || "N/A",
      ipo.issueSize || "N/A",
      ipo.openDate
        ? new Date(ipo.openDate).toLocaleDateString()
        : "N/A",
      ipo.closeDate
        ? new Date(ipo.closeDate).toLocaleDateString()
        : "N/A",
      ipo.status || "N/A",
      ipo.ipoPrice?.toString() || "N/A",
      ipo.listingPrice?.toString() || "N/A",
      ipo.listingGain?.toString() || "N/A",
      ipo.currentReturn?.toString() || "N/A"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            const value = String(cell).replace(/"/g, '""');
            return `"${value}"`;
          })
          .join(",")
      )
    ].join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="ipos-export.csv"'
    );

    return res.status(200).send(csvContent);
  } catch (error) {
    console.error("CSV Export Error:", error);
    return res.status(500).json({ error: "Failed to export CSV" });
  }
}
