-- Check if the column 'whatsapp' exists in the 'contacts' table
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'contacts' 
    AND COLUMN_NAME = 'whatsapp'
);

-- If the column does not exist, alter the table to add the column
IF @column_exists = 0 THEN
    ALTER TABLE contacts
    ADD COLUMN whatsapp VARCHAR(255) NULL AFTER phone;
END IF;