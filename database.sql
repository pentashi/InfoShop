ALTER TABLE `contacts` ADD `loyalty_points_balance` DECIMAL(8,2) DEFAULT 0 AFTER `loyalty_points`;

CREATE TABLE `loyalty_point_transactions` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `contact_id` BIGINT UNSIGNED NOT NULL,
    `store_id` BIGINT UNSIGNED NOT NULL,
    `points` DECIMAL(8,2) NOT NULL,
    `type` ENUM('earn', 'redeem', 'expire', 'manual_adjustment') NOT NULL,
    `description` VARCHAR(255) NULL,
    `expires_at` DATETIME NULL,
    `reference_id` BIGINT UNSIGNED NULL,
    `created_by` BIGINT UNSIGNED NOT NULL,
    `deleted_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `loyalty_point_transactions_contact_id_foreign` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON DELETE CASCADE,
    CONSTRAINT `loyalty_point_transactions_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
);