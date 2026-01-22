/*
  Warnings:

  - You are about to drop the column `String` on the `books` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[isbn]` on the table `books` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `isbn` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "books" DROP COLUMN "String",
ADD COLUMN     "isbn" CHAR(13) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "books_isbn_key" ON "books"("isbn");
