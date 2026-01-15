import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

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
      issueType,
      issueSize,
      openDate,
      closeDate,
      status,
      ipoPrice,
      listingPrice,
      listingGain,
      currentReturn
    } = req.body;

    // Validation
    if (
      !companyId ||
      !priceBand ||
      !issueType ||
      !issueSize ||
      !openDate ||
      !closeDate
    ) {
      return res.status(400).json({
        error:
          "companyId, priceBand, issueType, issueSize, openDate, and closeDate are required"
      });
    }

    // Verify company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Create IPO
    const newIPO = await prisma.iPO.create({
      data: {
        companyId,
        priceBand,
        issueType,
        issueSize,
        openDate: new Date(openDate),
        closeDate: new Date(closeDate),
        status: status || "Upcoming",
        ipoPrice: ipoPrice ? parseFloat(ipoPrice) : null,
        listingPrice: listingPrice ? parseFloat(listingPrice) : null,
        listingGain: listingGain ? parseFloat(listingGain) : null,
        currentReturn: currentReturn ? parseFloat(currentReturn) : null
      },
      include: {
        company: true,
        documents: true
      }
    });

    res.status(201).json({
      message: "IPO created successfully",
      ipo: newIPO
    });
  } catch (error: any) {
    console.error("Error creating IPO:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        error: "IPO with this configuration already exists"
      });
    }

    res.status(500).json({ error: "Failed to create IPO" });
  }
}
