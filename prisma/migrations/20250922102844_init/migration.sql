/*
  Warnings:

  - Changed the type of `status` on the `IPO` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."IPOStatus" AS ENUM ('UPCOMING', 'OPEN', 'CLOSED', 'LISTED');

-- AlterTable
ALTER TABLE "public"."IPO" DROP COLUMN "status",
ADD COLUMN     "status" "public"."IPOStatus" NOT NULL;
