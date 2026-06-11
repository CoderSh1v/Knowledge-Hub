/*
  Warnings:

  - A unique constraint covering the columns `[resourceId]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,name]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ResourceTag" ADD CONSTRAINT "ResourceTag_pkey" PRIMARY KEY ("resourceId", "tagId");

-- DropIndex
DROP INDEX "ResourceTag_resourceId_tagId_key";

-- AlterTable
ALTER TABLE "Session" ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionId");

-- DropIndex
DROP INDEX "Session_sessionId_key";

-- CreateIndex
CREATE UNIQUE INDEX "File_resourceId_key" ON "File"("resourceId");

-- CreateIndex
CREATE INDEX "File_resourceId_idx" ON "File"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_userId_name_key" ON "Project"("userId", "name");
