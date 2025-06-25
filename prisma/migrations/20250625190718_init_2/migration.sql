-- CreateTable
CREATE TABLE "project" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "livelink" TEXT,
    "githublink" TEXT,
    "tags" JSONB,
    "cover" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT DEFAULT 'AI',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);
