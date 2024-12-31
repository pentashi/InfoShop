CREATE TABLE `attachments` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `path` VARCHAR(255) NOT NULL,
    `file_name` VARCHAR(255) NULL,
    `attachment_type` VARCHAR(255) NULL,
    `size` BIGINT UNSIGNED NULL,
    `alt_text` VARCHAR(255) NULL,
    `title` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `products` 
ADD COLUMN `attachment_id` BIGINT UNSIGNED NULL AFTER `image_url`,
ADD CONSTRAINT `products_attachment_id_foreign` FOREIGN KEY (`attachment_id`) REFERENCES `attachments`(`id`) ON DELETE SET NULL;

