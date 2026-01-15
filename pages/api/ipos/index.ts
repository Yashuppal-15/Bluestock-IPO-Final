import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { search, status } = req.query;

      let where: any = {};

      if (search) {
        where.OR = [
          {
            company: {
              name: {
                contains: search as string,
                mode: "insensitive"
              }
            }
          },
          {
            priceBand: {
              contains: search as string,
              mode: "insensitive"
            }
          }
        ];
      }

      if (status) {
        where.status = status as string;
      }

      const ipos = await prisma.iPO.findMany({
        where,
        include: {
          company: true,
          documents: true
        },
        orderBy: {
          createdAt: "desc"
        }
      });

      res.status(200).json(ipos);
    } catch (error) {
      console.error("Error fetching IPOs:", error);
      res.status(500).json({ error: "Failed to fetch IPOs" });
    }
  } else if (req.method === "POST") {
    try {
      const { companyId, priceBand, issueType, issueSize, openDate, closeDate, status, ipoPrice, listingPrice, listingGain, currentReturn } = req.body;

      // Validation
      if (!companyId || !priceBand || !issueType || !issueSize || !openDate || !closeDate) {
        return res.status(400).json({
          error: "companyId, priceBand, issueType, issueSize, openDate, and closeDate are required"
        });
      }

      // Verify company exists
      const company = await prisma.company.findUnique({
        where: { id: companyId }
      });

      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

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
      res.status(500).json({ error: "Failed to create IPO" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
