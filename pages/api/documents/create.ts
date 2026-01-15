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
    const { ipoId, rhpPdf, drhpPdf } = req.body;

    if (!ipoId) {
      return res.status(400).json({ error: "IPO ID is required" });
    }

    // Check if document already exists for this IPO
    const existingDoc = await prisma.document.findFirst({
      where: { ipoId: parseInt(ipoId) },
    });

    let document;

    if (existingDoc) {
      // Update existing document
      document = await prisma.document.update({
        where: { id: existingDoc.id },
        data: {
          rhpPdf: rhpPdf || existingDoc.rhpPdf,
          drhpPdf: drhpPdf || existingDoc.drhpPdf,
        },
      });
    } else {
      // Create new document
      document = await prisma.document.create({
        data: {
          ipoId: parseInt(ipoId),
          rhpPdf: rhpPdf || "",
          drhpPdf: drhpPdf || "",
        },
      });
    }

    res.status(201).json(document);
  } catch (error) {
    console.error("Error creating/updating document:", error);
    res.status(500).json({ error: "Failed to save document" });
  }
}
