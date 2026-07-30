-- CreateTable
CREATE TABLE "m_vessels" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "imo_number" VARCHAR(7) NOT NULL,
    "call_sign" VARCHAR(10),
    "gross_tonnage" INTEGER,
    "teu_capacity" INTEGER,
    "loa_meters" DECIMAL(5,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3),
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,

    CONSTRAINT "m_vessels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "m_vessels_imo_number_key" ON "m_vessels"("imo_number");
