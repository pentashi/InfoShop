ALTER TABLE `sales`
ADD COLUMN `cart_snapshot` JSON NULL
AFTER `payment_status`;

-- 1. Add the `updated_by` column
ALTER TABLE `sales`
ADD COLUMN `updated_by` BIGINT UNSIGNED NULL
AFTER `created_by`;

-- 2. Add the foreign key constraint
ALTER TABLE `sales`
ADD CONSTRAINT `sales_updated_by_foreign`
FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`)
ON DELETE SET NULL;

-- 1. Add the `is_free` column
ALTER TABLE `sale_items`
ADD COLUMN `is_free` TINYINT(1) NOT NULL DEFAULT 0
AFTER `quantity`;

-- 2. Add the `meta_data` column
ALTER TABLE `sale_items`
ADD COLUMN `meta_data` JSON NULL
AFTER `discount`;

