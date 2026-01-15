import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      companyId,
      priceBand,
      openDate,
      closeDate,
      issueSize,
      issueType,
      listingDate,
      status,
      ipoPrice,
      listingPrice,
      listingGain,
      currentMarketPrice,
      currentReturn,
    } = req.body;

    // Validation
    if (
      !companyId ||
      !priceBand ||
      !openDate ||
      !closeDate ||
      !issueSize ||
      !issueType ||
      !status
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newIPO = await prisma.iPO.create({
      data: {
        companyId: parseInt(companyId),
        priceBand,
        openDate: new Date(openDate),
        closeDate: new Date(closeDate),
        issueSize,
        issueType,
        listingDate: listingDate ? new Date(listingDate) : null,
        status,
        ipoPrice: ipoPrice ? parseFloat(ipoPrice) : null,
        listingPrice: listingPrice ? parseFloat(listingPrice) : null,
        listingGain: listingGain ? parseFloat(listingGain) : null,
        currentMarketPrice: currentMarketPrice
          ? parseFloat(currentMarketPrice)
          : null,
        currentReturn: currentReturn ? parseFloat(currentReturn) : null,
      },
      include: { company: true },
    });

    res.status(201).json(newIPO);
  } catch (error) {
    console.error("Error creating IPO:", error);
    res.status(500).json({ error: "Failed to create IPO" });
  }
}
