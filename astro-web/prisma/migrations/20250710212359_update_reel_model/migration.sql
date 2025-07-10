/*
  Warnings:

  - The primary key for the `Reel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `embedHtml` on the `Reel` table. All the data in the column will be lost.
  - You are about to drop the column `embedUrl` on the `Reel` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Reel` table without a default value. This is not possible if the table is not empty.
  - Made the column `videoUrl` on table `Reel` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calendarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Reel" ("createdAt", "id", "thumbnail", "title", "videoUrl") SELECT "createdAt", "id", "thumbnail", "title", "videoUrl" FROM "Reel";
DROP TABLE "Reel";
ALTER TABLE "new_Reel" RENAME TO "Reel";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
