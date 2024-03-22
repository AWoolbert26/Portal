-- AlterTable
ALTER TABLE `Profile` ADD COLUMN `followers` INTEGER NULL;

-- CreateTable
CREATE TABLE `CategorySummary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `summary` VARCHAR(191) NOT NULL,
    `hardSkills` VARCHAR(191) NOT NULL,
    `commonTraits` VARCHAR(191) NOT NULL,
    `education` VARCHAR(191) NOT NULL,
    `averagePay` VARCHAR(191) NOT NULL,
    `threatOfAI` VARCHAR(191) NOT NULL,
    `categoryId` INTEGER NOT NULL,

    UNIQUE INDEX `CategorySummary_categoryId_key`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- -- AddForeignKey
-- ALTER TABLE `CategorySummary` ADD CONSTRAINT `CategorySummary_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
