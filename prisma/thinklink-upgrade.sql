-- Idempotent preparation for both an existing database and a fresh installation.
-- Create the composite index before dropping the old, more restrictive index.
-- If duplicate values prevent the new index, the transaction rolls back without data loss.
BEGIN;
ALTER TABLE IF EXISTS "public"."orders" ADD COLUMN IF NOT EXISTS "isInquiry" BOOLEAN NOT NULL DEFAULT false;
DO $$
BEGIN
  IF to_regclass('public.categories') IS NOT NULL THEN
    ALTER TABLE "public"."categories" ADD COLUMN IF NOT EXISTS "externalSource" TEXT;
    ALTER TABLE "public"."categories" ADD COLUMN IF NOT EXISTS "externalLevel" INTEGER;
    ALTER TABLE "public"."categories" ADD COLUMN IF NOT EXISTS "externalCatalogId" INTEGER;
    CREATE UNIQUE INDEX IF NOT EXISTS "categories_externalSource_externalLevel_externalCatalogId_key"
      ON "public"."categories" ("externalSource", "externalLevel", "externalCatalogId");
    DROP INDEX IF EXISTS "public"."categories_externalCatalogId_key";
  END IF;
END $$;
COMMIT;
