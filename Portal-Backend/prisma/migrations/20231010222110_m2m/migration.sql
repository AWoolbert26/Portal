/*
  Warnings:

  - You are about to drop the `category_user` table. If the table is not empty, all the data it contains will be lost.

*/
-- -- DropForeignKey
-- ALTER TABLE `category_user` DROP FOREIGN KEY `Category_User_categoryId_fkey`;

-- -- DropForeignKey
-- ALTER TABLE `category_user` DROP FOREIGN KEY `Category_User_userId_fkey`;

-- DropTable
DROP TABLE `category_user`;

-- CreateTable
CREATE TABLE `_CategoryToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CategoryToUser_AB_unique`(`A`, `B`),
    INDEX `_CategoryToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- -- AddForeignKey
-- ALTER TABLE `_CategoryToUser` ADD CONSTRAINT `_CategoryToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `_CategoryToUser` ADD CONSTRAINT `_CategoryToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
