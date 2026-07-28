-- CreateTable
CREATE TABLE "m_banks" (
    "id" UUID NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "short_name" VARCHAR(150) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3),
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,

    CONSTRAINT "m_banks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "m_banks_code_key" ON "m_banks"("code");

-- CreateIndex
CREATE UNIQUE INDEX "m_banks_short_name_key" ON "m_banks"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "m_banks_name_key" ON "m_banks"("name");
