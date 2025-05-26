-- CreateTable
CREATE TABLE "Idea" (
    "id" TEXT NOT NULL,
    "nick" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Idea_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Idea_nick_key" ON "Idea"("nick");
