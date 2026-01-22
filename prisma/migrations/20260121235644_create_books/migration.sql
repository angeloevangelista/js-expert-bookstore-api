-- CreateTable
CREATE TABLE "books" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(56) NOT NULL,
    "summary" VARCHAR(255) NOT NULL,
    "year" INTEGER NOT NULL,
    "pages" INTEGER NOT NULL,
    "String" CHAR(13) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);
