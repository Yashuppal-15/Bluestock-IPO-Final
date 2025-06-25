import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const ipos = await prisma.iPO.findMany({
      include: {
        company: true,
        documents: true,
      },
      orderBy: { id: 'desc' },
    });
    return res.status(200).json(ipos);
  }

  if (req.method === 'POST') {
    const data = req.body;

    const company = await prisma.company.create({
      data: {
        name: data.company.name,
        logo: data.company.logo,
      },
    });

    const ipo = await prisma.iPO.create({
      data: {
        companyId: company.id,
        priceBand: data.priceBand,
        openDate: new Date(data.openDate),
        closeDate: new Date(data.closeDate),
        issueSize: data.issueSize,
        issueType: data.issueType,
        listingDate: new Date(data.listingDate),
        status: data.status,
        ipoPrice: data.ipoPrice,
        listingPrice: data.listingPrice,
        listingGain: data.listingGain,
        currentMarketPrice: data.currentMarketPrice,
        currentReturn: data.currentReturn,
        documents: {
          create: {
            rhpPdf: data.documents.rhpPdf,
            drhpPdf: data.documents.drhpPdf,
          },
        },
      },
    });

    return res.status(201).json(ipo);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
