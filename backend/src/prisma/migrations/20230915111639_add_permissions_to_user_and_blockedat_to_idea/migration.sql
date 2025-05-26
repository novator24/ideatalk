-- CreateEnum
CREATE TYPE "UserPermission" AS ENUM ('BLOCK_IDEAS', 'ALL');

-- AlterTable
ALTER TABLE "Idea" ADD COLUMN     "blockedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "permissions" "UserPermission"[];
