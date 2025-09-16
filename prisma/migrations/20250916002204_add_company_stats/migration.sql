-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN "rating" INTEGER;

-- CreateTable
CREATE TABLE "CompanyStats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company" TEXT NOT NULL,
    "candidatesActive" INTEGER NOT NULL,
    "companyViews" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyStats_company_key" ON "CompanyStats"("company");
