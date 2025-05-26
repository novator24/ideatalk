-- CreateTable
CREATE TABLE "IdeaLike" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ideaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "IdeaLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IdeaLike_ideaId_userId_key" ON "IdeaLike"("ideaId", "userId");

-- AddForeignKey
ALTER TABLE "IdeaLike" ADD CONSTRAINT "IdeaLike_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdeaLike" ADD CONSTRAINT "IdeaLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
