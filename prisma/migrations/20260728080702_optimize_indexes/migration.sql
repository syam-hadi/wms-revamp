-- DropIndex
DROP INDEX "m_configs_config_group_idx";

-- DropIndex
DROP INDEX "m_configs_config_group_status_idx";

-- DropIndex
DROP INDEX "m_configs_status_idx";

-- CreateIndex
CREATE INDEX "m_cities_m_province_id_deleted_at_idx" ON "m_cities"("m_province_id", "deleted_at");

-- CreateIndex
CREATE INDEX "m_configs_config_group_status_deleted_at_idx" ON "m_configs"("config_group", "status", "deleted_at");

-- CreateIndex
CREATE INDEX "m_provinces_m_country_id_deleted_at_idx" ON "m_provinces"("m_country_id", "deleted_at");
