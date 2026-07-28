-- CreateTable
CREATE TABLE "m_rates" (
    "id" UUID NOT NULL,
    "currency_code" UUID NOT NULL,
    "description" VARCHAR(100),
    "value" DECIMAL(12,4) NOT NULL,
    "valid_from" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3),
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,

    CONSTRAINT "m_rates_pkey" PRIMARY KEY ("id")
);
