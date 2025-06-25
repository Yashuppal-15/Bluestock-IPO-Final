/*
  Warnings:

  - You are about to drop the column `logoUrl` on the `Company` table. All the data in the column will be lost.
  - You are about to alter the column `ipoPrice` on the `IPO` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `listingPrice` on the `IPO` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `listingGain` on the `IPO` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `currentMarketPrice` on the `IPO` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `currentReturn` on the `IPO` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - Added the required column `logo` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `IPO` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "logoUrl",
ADD COLUMN     "logo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "IPO" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "ipoPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "listingPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "listingGain" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "currentMarketPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "currentReturn" SET DATA TYPE DOUBLE PRECISION;

-- DropEnum
DROP TYPE "IPOStatus";
