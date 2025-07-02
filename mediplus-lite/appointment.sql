CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    department VARCHAR(100),
    doctor VARCHAR(100),
    appointment_date DATE,
    message TEXT
);
