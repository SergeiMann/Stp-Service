-- Apply to an existing PostgreSQL database before deploying the ThinkLink update.
-- The old index is stronger than the new composite index, so existing data remains valid.
BEGIN;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "isInquiry" BOOLEAN NOT NULL DEFAULT false;
CREATE UNIQUE INDEX IF NOT EXISTS "categories_externalSource_externalLevel_externalCatalogId_key"
  ON "categories" ("externalSource", "externalLevel", "externalCatalogId");
DROP INDEX IF EXISTS "categories_externalCatalogId_key";
COMMIT;
