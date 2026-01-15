import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { ipoId } = req.body;

    if (!ipoId) {
      return res.status(400).json({ error: "IPO ID is required" });
    }

    // TODO: Implement watchlist functionality
    // For now, we'll return a success message
    // In production, you would store this in a Watchlist table
    
    res.status(200).json({ 
      message: "IPO saved to watchlist",
      ipoId,
      timestamp: new Date()
    });
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    res.status(500).json({ error: "Failed to add to watchlist" });
  }
}
