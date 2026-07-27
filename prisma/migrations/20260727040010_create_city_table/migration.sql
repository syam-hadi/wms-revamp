-- CreateTable
CREATE TABLE "m_cities" (
    "id" UUID NOT NULL,
    "m_province_id" UUID NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3),
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,

    CONSTRAINT "m_cities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "m_cities_m_province_id_code_key" ON "m_cities"("m_province_id", "code");

-- AddForeignKey
ALTER TABLE "m_cities" ADD CONSTRAINT "m_cities_m_province_id_fkey" FOREIGN KEY ("m_province_id") REFERENCES "m_provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
