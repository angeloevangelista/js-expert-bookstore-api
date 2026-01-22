/*
  Warnings:

  - Added the required column `author_id` to the `books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publisher_id` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "books" ADD COLUMN     "author_id" UUID NOT NULL,
ADD COLUMN     "category_id" UUID NOT NULL,
ADD COLUMN     "publisher_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publishers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
