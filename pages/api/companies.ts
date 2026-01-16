import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const companies = await prisma.company.findMany({
        include: {
          ipos: true
        }
      });
      res.status(200).json(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  } else if (req.method === "POST") {
    try {
      const { name, symbol, logo } = req.body;

      // Validation
      if (!name || !symbol) {
        return res.status(400).json({
          error: "Name and symbol are required"
        });
      }

      const newCompany = await prisma.company.create({
        data: {
          name,
          symbol,
          logo: logo || ""
        }
      });

      res.status(201).json(newCompany);
    } catch (error: any) {
      console.error("Error creating company:", error);

      if (error.code === "P2002") {
        const field = error.meta?.target?.[0] || "field";
        return res.status(409).json({
          error: `Company with this ${field} already exists`
        });
      }

      res.status(500).json({ error: "Failed to create company" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
