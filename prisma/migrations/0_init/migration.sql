-- CreateEnum
CREATE TYPE "IPOStatus" AS ENUM ('UPCOMING', 'OPEN', 'CLOSED', 'LISTED');

-- CreateTable
CREATE TABLE "companies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL UNIQUE,
    "symbol" TEXT NOT NULL UNIQUE,
    "logo" TEXT,
    
    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ipos" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "priceBand" TEXT NOT NULL,
    "issueType" TEXT NOT NULL,
    "issueSize" TEXT NOT NULL,
    "openDate" TIMESTAMP(3) NOT NULL,
    "closeDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Upcoming',
    "ipoPrice" DOUBLE PRECISION,
    "listingPrice" DOUBLE PRECISION,
    "listingGain" DOUBLE PRECISION,
    "currentReturn" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    
    CONSTRAINT "ipos_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ipos_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "ipoId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    
    CONSTRAINT "documents_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "documents_ipoId_fkey" FOREIGN KEY ("ipoId") REFERENCES "ipos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "documents_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
