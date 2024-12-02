CREATE DATABASE feildManager;
USE feildManager;

CREATE TABLE bananas(
    userName TEXT NOT NULL,
    passwords TEXT NOT NULL
);

INSERT INTO bananas (userName, passwords)
VALUES
('xander', '12345');