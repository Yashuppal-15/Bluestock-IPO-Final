-- CreateEnum
CREATE TYPE "IPOStatus" AS ENUM ('UPCOMING', 'OPEN', 'CLOSED', 'LISTED');

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IPO" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "priceBand" TEXT NOT NULL,
    "openDate" TIMESTAMP(3) NOT NULL,
    "closeDate" TIMESTAMP(3) NOT NULL,
    "issueSize" TEXT NOT NULL,
    "issueType" TEXT NOT NULL,
    "listingDate" TIMESTAMP(3) NOT NULL,
    "status" "IPOStatus" NOT NULL,
    "ipoPrice" DECIMAL(65,30) NOT NULL,
    "listingPrice" DECIMAL(65,30) NOT NULL,
    "listingGain" DECIMAL(65,30) NOT NULL,
    "currentMarketPrice" DECIMAL(65,30) NOT NULL,
    "currentReturn" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "IPO_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "ipoId" INTEGER NOT NULL,
    "rhpPdf" TEXT NOT NULL,
    "drhpPdf" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IPO" ADD CONSTRAINT "IPO_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_ipoId_fkey" FOREIGN KEY ("ipoId") REFERENCES "IPO"("id") ON DELETE CASCADE ON UPDATE CASCADE;
