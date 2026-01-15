const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Create Tata company with IPO
  const tata = await prisma.company.create({
    data: {
      name: "Tata Technologies",
      symbol: "TATA",
      logo: "/logos/tata.png"
    }
  });

  // Create Tata IPO
  const tataIpo = await prisma.iPO.create({
    data: {
      companyId: tata.id,
      priceBand: "₹475 - ₹500",
      openDate: new Date("2023-11-22"),
      closeDate: new Date("2023-11-24"),
      issueSize: "₹3,042.51 Cr",
      issueType: "Book Built Issue IPO",
      status: "LISTED",
      ipoPrice: 500,
      listingPrice: 1200,
      listingGain: 140,
      currentReturn: 130
    }
  });

  // Create Tata documents
  await prisma.document.createMany({
    data: [
      {
        ipoId: tataIpo.id,
        companyId: tata.id,
        type: "RHP",
        url: "/docs/tata-rhp.pdf"
      },
      {
        ipoId: tataIpo.id,
        companyId: tata.id,
        type: "DRHP",
        url: "/docs/tata-drhp.pdf"
      }
    ]
  });

  // Create Ola company with IPO
  const ola = await prisma.company.create({
    data: {
      name: "Ola Electric",
      symbol: "OLA",
      logo: "/logos/ola.png"
    }
  });

  // Create Ola IPO
  const olaIpo = await prisma.iPO.create({
    data: {
      companyId: ola.id,
      priceBand: "₹125 - ₹135",
      openDate: new Date("2024-01-15"),
      closeDate: new Date("2024-01-18"),
      issueSize: "₹2,500 Cr",
      issueType: "Book Built Issue IPO",
      status: "UPCOMING",
      ipoPrice: 0,
      listingPrice: 0,
      listingGain: 0,
      currentReturn: 0
    }
  });

  // Create Ola documents
  await prisma.document.createMany({
    data: [
      {
        ipoId: olaIpo.id,
        companyId: ola.id,
        type: "RHP",
        url: "/docs/ola-rhp.pdf"
      },
      {
        ipoId: olaIpo.id,
        companyId: ola.id,
        type: "DRHP",
        url: "/docs/ola-drhp.pdf"
      }
    ]
  });

  console.log("✓ Seed data created successfully!");
  console.log("✓ Created 2 companies with IPOs and documents");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
