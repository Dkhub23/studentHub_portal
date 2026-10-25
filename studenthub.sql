CREATE DATABASE IF NOT EXISTS studenthub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE studenthub;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','faculty','student') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL UNIQUE,
  enrollment_no VARCHAR(40) NOT NULL UNIQUE,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  mobile VARCHAR(15) NULL,
  course VARCHAR(120) NOT NULL DEFAULT '',
  registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_students_mobile (mobile),
  CONSTRAINT fk_students_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  starts_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  actor_name VARCHAR(120) NOT NULL,
  actor_role VARCHAR(32) NOT NULL,
  action VARCHAR(100) NOT NULL,
  details JSON NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_created (created_at),
  INDEX idx_audit_actor (user_id, created_at),
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Development sample data. Change the password immediately in a real deployment.
INSERT INTO users (full_name,email,password_hash,role) VALUES
('CHARUSAT Admin','admin@charusat.edu.in','$2y$10$azwXLa9yxueTwxzG7lgz.ueK4WdQ26P/2GvSiJHUJdbZ2aOJ8gAky','admin'),
('Aarav Shah','aarav@charusat.edu.in','$2y$10$tNNbcAEhIfgDy7AyBW/YQeeJXJHJrT9zRhCSPNakJaHllTGOUU.oa','student')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

INSERT INTO students (enrollment_no,full_name,email,mobile,course,registered_at) VALUES
('23CE045','Dhruvi Kakadia','dhruvi@charusat.edu.in','9876543210','B.Tech Computer Engineering','2026-10-20 10:30:00'),
('23IT012','Rudra Patel','rudra@charusat.edu.in','9823456781','B.Tech Information Technology','2026-10-19 14:15:00'),
('22CE088','Aarav Shah','aarav.shah@charusat.edu.in','9876123450','B.Tech Computer Engineering','2026-10-18 09:00:00')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

INSERT INTO events (name,starts_at) VALUES
('Tech Fest 2026','2026-11-05 09:00:00'),('AI Workshop','2026-11-12 10:00:00')
ON DUPLICATE KEY UPDATE name=VALUES(name);
