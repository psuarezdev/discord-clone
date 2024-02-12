-- AlterTable
ALTER TABLE "direct_messages" ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "content" DROP NOT NULL;
