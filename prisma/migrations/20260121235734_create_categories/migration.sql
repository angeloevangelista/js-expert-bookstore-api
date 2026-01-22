-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(32) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);
