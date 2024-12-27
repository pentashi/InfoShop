ALTER TABLE salary_records
    ADD COLUMN remarks TEXT NULL AFTER net_salary,
    ADD COLUMN adjusts_balance BOOLEAN DEFAULT FALSE AFTER remarks;
