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
    const { ipoId, companyId, type, url } = req.body;

    // Validation
    if (!ipoId || !companyId || !type || !url) {
      return res.status(400).json({
        error: "ipoId, companyId, type, and url are required"
      });
    }

    // Validate type
    if (!["RHP", "DRHP"].includes(type)) {
      return res.status(400).json({
        error: "Type must be either RHP or DRHP"
      });
    }

    // Check if document already exists
    const existingDoc = await prisma.document.findFirst({
      where: {
        ipoId,
        type
      }
    });

    if (existingDoc) {
      // Update existing
      const updated = await prisma.document.update({
        where: { id: existingDoc.id },
        data: {
          url,
          updatedAt: new Date()
        }
      });
      return res.status(200).json({
        message: "Document updated successfully",
        document: updated
      });
    }

    // Create new
    const newDocument = await prisma.document.create({
      data: {
        ipoId,
        companyId,
        type,
        url
      }
    });

    res.status(201).json({
      message: "Document created successfully",
      document: newDocument
    });
  } catch (error: any) {
    console.error("Error creating/updating document:", error);
    res.status(500).json({ error: "Failed to create/update document" });
  }
}
