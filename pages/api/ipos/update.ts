import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id, ...updateData } = req.body;

    if (!id) {
      return res.status(400).json({ error: "IPO ID is required" });
    }

    // Convert string values to proper types
    const processedData: any = {};

    for (const [key, value] of Object.entries(updateData)) {
      if (value === null || value === "") {
        processedData[key] = null;
        continue;
      }

      if (
        key === "openDate" ||
        key === "closeDate" ||
        key === "listingDate"
      ) {
        processedData[key] = new Date(value as string);
      } else if (
        key === "ipoPrice" ||
        key === "listingPrice" ||
        key === "listingGain" ||
        key === "currentMarketPrice" ||
        key === "currentReturn"
      ) {
        processedData[key] = parseFloat(value as string);
      } else if (key === "companyId") {
        processedData[key] = parseInt(value as string);
      } else {
        processedData[key] = value;
      }
    }

    const updatedIPO = await prisma.iPO.update({
      where: { id: parseInt(id) },
      data: processedData,
      include: { company: true },
    });

    res.status(200).json(updatedIPO);
  } catch (error) {
    console.error("Error updating IPO:", error);
    res.status(500).json({ error: "Failed to update IPO" });
  }
}
