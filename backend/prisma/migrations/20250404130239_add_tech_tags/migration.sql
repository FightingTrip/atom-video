/*
  Warnings:

  - The values [USER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `commentCount` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `likeCount` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `viewCount` on the `Video` table. All the data in the column will be lost.
  - The `tags` column on the `Video` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BANNED');

-- CreateEnum
CREATE TYPE "VideoStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'PRIVATE', 'DELETED');

-- CreateEnum
CREATE TYPE "TechTag" AS ENUM ('JAVASCRIPT', 'TYPESCRIPT', 'PYTHON', 'JAVA', 'C_SHARP', 'C_PLUS_PLUS', 'GO', 'RUST', 'SWIFT', 'KOTLIN', 'PHP', 'RUBY', 'REACT', 'VUE', 'ANGULAR', 'SVELTE', 'HTML', 'CSS', 'SASS', 'WEBPACK', 'VITE', 'NODEJS', 'EXPRESS', 'NESTJS', 'SPRING', 'DJANGO', 'FLASK', 'LARAVEL', 'GRAPHQL', 'REST', 'POSTGRESQL', 'MYSQL', 'MONGODB', 'REDIS', 'SQLITE', 'AWS', 'AZURE', 'GCP', 'DOCKER', 'KUBERNETES', 'GIT', 'VSCODE', 'JETBRAINS', 'POSTMAN', 'ALGORITHMS', 'DATA_STRUCTURES', 'DESIGN_PATTERNS', 'SYSTEM_DESIGN', 'COMPILER', 'OPERATING_SYSTEM', 'TUTORIAL', 'BEST_PRACTICES', 'PERFORMANCE', 'SECURITY', 'TESTING', 'DEVOPS');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('GUEST', 'MEMBER', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "nickname" TEXT,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "role" SET DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "commentCount",
DROP COLUMN "likeCount",
DROP COLUMN "viewCount",
ADD COLUMN     "status" "VideoStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "duration" DROP NOT NULL,
DROP COLUMN "tags",
ADD COLUMN     "tags" "TechTag"[];

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");

-- CreateIndex
CREATE INDEX "Favorite_videoId_idx" ON "Favorite"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_videoId_key" ON "Favorite"("userId", "videoId");

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
