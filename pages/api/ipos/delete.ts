import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "IPO ID is required" });
    }

    const deletedIPO = await prisma.iPO.delete({
      where: { id: parseInt(id as string) },
    });

    res.status(200).json({ message: "IPO deleted successfully", deletedIPO });
  } catch (error) {
    console.error("Error deleting IPO:", error);
    res.status(500).json({ error: "Failed to delete IPO" });
  }
}
