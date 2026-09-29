ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "manufacturerPartNumber" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "endUserRequired" BOOLEAN;
