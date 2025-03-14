ALTER TABLE `sales`
ADD COLUMN `deleted_by` BIGINT UNSIGNED NULL AFTER `created_by`,
ADD CONSTRAINT `fk_sales_deleted_by_users_id` FOREIGN KEY (`deleted_by`) REFERENCES `users`(`id`) ON DELETE SET NULL;
