CREATE TABLE `cheques` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `cheque_number` VARCHAR(255) NOT NULL,
    `cheque_date` DATE NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `issued_date` DATE NOT NULL,
    `bank` VARCHAR(255) DEFAULT NULL,
    `status` VARCHAR(255) NOT NULL,
    `remark` TEXT DEFAULT NULL,
    `direction` ENUM('issued', 'received') NOT NULL,
    `store_id` BIGINT UNSIGNED NOT NULL,
    `created_by` BIGINT UNSIGNED NOT NULL,
    `deleted_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
