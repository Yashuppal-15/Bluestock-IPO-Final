import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const companies = await prisma.company.findMany({
        include: {
          ipos: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      res.status(200).json(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  } else if (req.method === "POST") {
    try {
      const { name, logo } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Company name is required" });
      }

      const newCompany = await prisma.company.create({
        data: {
          name,
          logo: logo || "",
        },
      });

      res.status(201).json(newCompany);
    } catch (error) {
      console.error("Error creating company:", error);
      res.status(500).json({ error: "Failed to create company" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
