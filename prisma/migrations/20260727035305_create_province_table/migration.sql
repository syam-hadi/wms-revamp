-- CreateTable
CREATE TABLE "m_provinces" (
    "id" UUID NOT NULL,
    "m_country_id" UUID NOT NULL,
    "code" VARCHAR(5) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3),
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,

    CONSTRAINT "m_provinces_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "m_provinces_m_country_id_code_key" ON "m_provinces"("m_country_id", "code");

-- AddForeignKey
ALTER TABLE "m_provinces" ADD CONSTRAINT "m_provinces_m_country_id_fkey" FOREIGN KEY ("m_country_id") REFERENCES "m_countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
