import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  if (method === 'GET') {
    const ipo = await prisma.iPO.findUnique({
      where: { id: parseInt(id) },
      include: {
        company: true,
        documents: true,
      },
    });
    return res.status(200).json(ipo);
  }

  if (method === 'DELETE') {
    await prisma.document.deleteMany({ where: { ipoId: parseInt(id) } });
    await prisma.iPO.delete({ where: { id: parseInt(id) } });
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
