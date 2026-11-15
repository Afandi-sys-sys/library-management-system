-- Add password storage without rewriting the already-applied initial migration.
-- Existing accounts receive a non-login sentinel and must register again or be reset.
ALTER TABLE "User"
ADD COLUMN "passwordHash" TEXT NOT NULL DEFAULT '!PASSWORD_RESET_REQUIRED!';

ALTER TABLE "User"
ALTER COLUMN "passwordHash" DROP DEFAULT;

ALTER TABLE "Book"
ADD COLUMN "totalCopies" INTEGER NOT NULL DEFAULT 1;