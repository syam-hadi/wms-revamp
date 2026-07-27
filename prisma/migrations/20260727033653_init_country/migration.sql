-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('EMPLOYEE', 'VENDOR', 'CUSTOMER');

-- CreateTable
CREATE TABLE "m_configs" (
    "id" UUID NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(100),
    "config_group" VARCHAR(50) NOT NULL,
    "option_type" VARCHAR(20) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3),
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,

    CONSTRAINT "m_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_countries" (
    "id" UUID NOT NULL,
    "code" VARCHAR(5) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3),
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,

    CONSTRAINT "m_countries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "m_configs_config_group_idx" ON "m_configs"("config_group");

-- CreateIndex
CREATE INDEX "m_configs_status_idx" ON "m_configs"("status");

-- CreateIndex
CREATE INDEX "m_configs_config_group_status_idx" ON "m_configs"("config_group", "status");

-- CreateIndex
CREATE UNIQUE INDEX "m_configs_config_group_code_key" ON "m_configs"("config_group", "code");

-- CreateIndex
CREATE UNIQUE INDEX "m_countries_code_key" ON "m_countries"("code");
