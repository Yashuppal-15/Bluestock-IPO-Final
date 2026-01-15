// pages/api/ipos/[id].ts - UPDATE to include DELETE method:
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    const ipo = await prisma.iPO.findUnique({
      where: { id: parseInt(id as string) },
      include: {
        company: true,
        documents: true,
      },
    });
    return res.status(200).json(ipo);
  }

  if (req.method === "DELETE") {
    try {
      // Delete documents first
      await prisma.document.deleteMany({ 
        where: { ipoId: parseInt(id as string) } 
      });
      
      // Then delete IPO
      await prisma.iPO.delete({ 
        where: { id: parseInt(id as string) } 
      });
      
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting IPO:", error);
      return res.status(500).json({ error: "Failed to delete IPO" });
    }
  }

  res.setHeader("Allow", ["GET", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
