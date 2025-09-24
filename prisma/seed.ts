const { PrismaClient, IPOStatus } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const tata = await prisma.company.create({
    data: {
      name: "Tata Technologies",
      logo: "/logos/tata.png",
      ipos: {
        create: {
          priceBand: "₹475 - ₹500",
          openDate: new Date("2023-11-22"),
          closeDate: new Date("2023-11-24"),
          issueSize: "₹3,042.51 Cr",
          issueType: "Book Built Issue IPO",
          listingDate: new Date("2023-12-05"),
          status: IPOStatus.LISTED,
          ipoPrice: 500,
          listingPrice: 1200,
          listingGain: 140,
          currentMarketPrice: 1150,
          currentReturn: 130,
          documents: {
            create: {
              rhpPdf: "/docs/tata-rhp.pdf",
              drhpPdf: "/docs/tata-drhp.pdf"
            }
          }
        }
      }
    }
  });

  const ola = await prisma.company.create({
    data: {
      name: "Ola Electric",
      logo: "/logos/ola.png",
      ipos: {
        create: {
          priceBand: "₹125 - ₹135",
          openDate: new Date("2024-01-15"),
          closeDate: new Date("2024-01-18"),
          issueSize: "₹2,500 Cr",
          issueType: "Book Built Issue IPO",
          listingDate: new Date("2024-01-25"),
          status: IPOStatus.UPCOMING,
          ipoPrice: 0,
          listingPrice: 0,
          listingGain: 0,
          currentMarketPrice: 0,
          currentReturn: 0,
          documents: {
            create: {
              rhpPdf: "/docs/ola-rhp.pdf",
              drhpPdf: "/docs/ola-drhp.pdf"
            }
          }
        }
      }
    }
  });

  console.log({ tata, ola });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
