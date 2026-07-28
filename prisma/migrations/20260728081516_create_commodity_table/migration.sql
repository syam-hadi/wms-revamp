-- CreateTable
CREATE TABLE "m_commodities" (
    "id" UUID NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "hs_code" VARCHAR(12),
    "category" VARCHAR(50) NOT NULL,
    "is_hazardous" BOOLEAN NOT NULL,
    "imdg_class" VARCHAR(10),
    "requires_reefer" BOOLEAN NOT NULL,
    "min_temperature" DECIMAL(4,2),
    "max_temperature" DECIMAL(4,2),
    "remarks" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3),
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,

    CONSTRAINT "m_commodities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "m_commodities_code_key" ON "m_commodities"("code");

-- CreateIndex
CREATE UNIQUE INDEX "m_commodities_name_key" ON "m_commodities"("name");
