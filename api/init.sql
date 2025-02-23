SELECT 'CREATE DATABASE loans_api' 
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'loans_api')\gexec

-- Connect to the newly created database
\c loans_api;

-- Create Users table
CREATE TABLE IF NOT EXISTS "Users" (
    id SERIAL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'admin')) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Create Loans table
CREATE TABLE IF NOT EXISTS "Loans" (
    id SERIAL,
    user_id INTEGER NOT NULL,
    amount FLOAT NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    duration INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    remaining_balance FLOAT NOT NULL,
    total_paid FLOAT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_id
        FOREIGN KEY (user_id)
        REFERENCES "Users"(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    PRIMARY KEY (id)
);

-- Create Payments table
CREATE TABLE IF NOT EXISTS "Payments" (
    id SERIAL,
    loan_id INTEGER NOT NULL,
    amount_paid FLOAT NOT NULL,
    payment_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_loan_id
        FOREIGN KEY (loan_id)
        REFERENCES "Loans"(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    PRIMARY KEY (id)
);