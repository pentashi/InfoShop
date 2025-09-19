ALTER TABLE `sale_items`
ADD COLUMN `free_quantity` DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER `quantity`;

ALTER TABLE `sale_items`
ADD COLUMN `flat_discount` DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER `discount`;
