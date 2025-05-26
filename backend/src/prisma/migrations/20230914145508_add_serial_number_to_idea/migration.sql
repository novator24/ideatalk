/*
  Warnings:

  - A unique constraint covering the columns `[serialNumber]` on the table `Idea` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Idea" ADD COLUMN     "serialNumber" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Idea_serialNumber_key" ON "Idea"("serialNumber");
