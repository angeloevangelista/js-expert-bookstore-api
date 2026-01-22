-- CreateTable
CREATE TABLE "publishers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(32) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "cellphone" VARCHAR(24) NOT NULL,

    CONSTRAINT "publishers_pkey" PRIMARY KEY ("id")
);
