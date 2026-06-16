/*
  Warnings:

  - A unique constraint covering the columns `[userId,title,type]` on the table `Resource` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "ActivityType" ADD VALUE 'PROJECT_DELETED';

-- CreateIndex
CREATE UNIQUE INDEX "Resource_userId_title_type_key" ON "Resource"("userId", "title", "type");
