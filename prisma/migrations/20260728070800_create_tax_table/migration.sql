-- CreateTable
CREATE TABLE "m_taxes" (
    "id" UUID NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(100),
    "value" DECIMAL(12,4) NOT NULL,
    "flag_type" BOOLEAN NOT NULL,
    "coa" VARCHAR(20),
    "tax_code" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3),
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,

    CONSTRAINT "m_taxes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "m_taxes_code_key" ON "m_taxes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "m_taxes_name_key" ON "m_taxes"("name");
