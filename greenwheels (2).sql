-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3308
-- Generation Time: May 01, 2026 at 12:33 AM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `greenwheels`
--

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `CalculateProfileCompletion`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CalculateProfileCompletion` (IN `userId` INT)   BEGIN
    DECLARE total_fields INT DEFAULT 5;
    DECLARE filled_fields INT DEFAULT 0;
    DECLARE completion_pct INT DEFAULT 0;
    DECLARE eligible BOOLEAN DEFAULT FALSE;
    
    SELECT 
        (CASE WHEN `user_type` IS NOT NULL AND `user_type` != 'other' THEN 1 ELSE 0 END) +
        (CASE WHEN `date_of_birth` IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN `address` IS NOT NULL AND `address` != '' THEN 1 ELSE 0 END) +
        (CASE WHEN `city` IS NOT NULL AND `city` != '' THEN 1 ELSE 0 END) +
        (CASE 
            WHEN `user_type` = 'student' AND `student_id_url` IS NOT NULL AND `student_id_url` != '' THEN 1 
            WHEN `user_type` = 'employed' AND `employment_doc_url` IS NOT NULL AND `employment_doc_url` != '' THEN 1
            WHEN `user_type` = 'tourist' THEN 1
            ELSE 0 
        END)
    INTO filled_fields
    FROM `profiles`
    WHERE `user_id` = userId;
    
    SET completion_pct = (filled_fields * 100) / total_fields;
    SET eligible = IF(completion_pct >= 75, TRUE, FALSE);
    
    UPDATE `profiles` 
    SET 
        `completion_pct` = completion_pct,
        `is_eligible_for_ai_pricing` = eligible
    WHERE `user_id` = userId;
    
    SELECT completion_pct AS 'completion', eligible AS 'ai_eligible';
END$$

DROP PROCEDURE IF EXISTS `UpdateProfileCompletion`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateProfileCompletion` (IN `userId` INT)   BEGIN
    CALL CalculateProfileCompletion(userId);
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `ai_pricing_settings`
--

DROP TABLE IF EXISTS `ai_pricing_settings`;
CREATE TABLE IF NOT EXISTS `ai_pricing_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `setting_value` decimal(5,2) NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ai_pricing_settings`
--

INSERT INTO `ai_pricing_settings` (`id`, `setting_key`, `setting_value`, `description`, `is_active`, `updated_at`) VALUES
(1, 'LOYALTY_GOLD', 0.15, '10+ rides / 30 days', 1, '2026-04-16 16:32:02'),
(2, 'LOYALTY_SILVER', 0.05, '5-9 rides / 30 days', 1, '2026-04-16 16:32:02'),
(3, 'PROFILE_STUDENT', 0.20, 'Student discount', 1, '2026-04-16 16:32:02'),
(4, 'PROFILE_EMPLOYED', 0.05, 'Regular commuter discount', 1, '2026-04-16 16:32:02'),
(5, 'DEMAND_SURGE', 1.15, 'Fleet >80% occupied', 1, '2026-04-16 16:32:02'),
(6, 'DEMAND_LOW', 0.85, 'Fleet <30% occupied', 1, '2026-04-16 16:32:02');

-- --------------------------------------------------------

--
-- Table structure for table `bike_types`
--

DROP TABLE IF EXISTS `bike_types`;
CREATE TABLE IF NOT EXISTS `bike_types` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `available` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bike_types`
--

INSERT INTO `bike_types` (`id`, `title`, `image`, `type`, `base_price`, `available`, `created_at`) VALUES
(1, 'Vélo Électrique Standard', 'bike-electric-1.jpg', 'electric', 15.00, 1, '2026-04-16 20:38:38'),
(2, 'Vélo Électrique Standard', 'bike-electric-1.jpg', 'electric', 15.00, 1, '2026-04-16 20:38:38'),
(3, 'Vélo Classique', 'bike-classic-1.jpg', 'classic', 8.00, 1, '2026-04-16 20:38:38'),
(4, 'Vélo Classique', 'bike-classic-1.jpg', 'classic', 8.00, 1, '2026-04-16 20:38:38'),
(5, 'VTT Électrique', 'bike-mountain-1.jpg', 'electric', 20.00, 1, '2026-04-16 20:38:38'),
(6, 'VTT Électrique', 'bike-mountain-1.jpg', 'electric', 20.00, 1, '2026-04-16 20:38:38'),
(7, 'Vélo de Ville', 'bike-city-1.jpg', 'classic', 10.00, 1, '2026-04-16 20:38:38'),
(8, 'Vélo de Ville', 'bike-city-1.jpg', 'classic', 10.00, 1, '2026-04-16 20:38:38'),
(9, 'Vélo Cargo Électrique', 'bike-cargo-1.jpg', 'electric', 25.00, 1, '2026-04-16 20:38:38'),
(10, 'Vélo Cargo Électrique', 'bike-cargo-1.jpg', 'electric', 25.00, 1, '2026-04-16 20:38:38'),
(11, 'Trottinette Électrique', 'scooter-1.jpg', 'scooter', 12.00, 1, '2026-04-16 20:38:38'),
(12, 'Trottinette Électrique', 'scooter-1.jpg', 'scooter', 12.00, 1, '2026-04-16 20:38:38');

-- --------------------------------------------------------

--
-- Table structure for table `gps_logs`
--

DROP TABLE IF EXISTS `gps_logs`;
CREATE TABLE IF NOT EXISTS `gps_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vehicle_id` int NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `battery_level` int NOT NULL,
  `recorded_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_vehicle` (`vehicle_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `maintenance`
--

DROP TABLE IF EXISTS `maintenance`;
CREATE TABLE IF NOT EXISTS `maintenance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vehicle_id` int NOT NULL,
  `description` varchar(170) COLLATE utf8mb4_general_ci NOT NULL,
  `type` enum('repair','cleaning','battery','other') COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('pending','in progress','completed') COLLATE utf8mb4_general_ci NOT NULL,
  `scheduled_date` date NOT NULL,
  `resolved_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_maintenance` (`vehicle_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE IF NOT EXISTS `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `subscription_id` int DEFAULT NULL,
  `ride_id` int DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `method` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `user_id`, `subscription_id`, `ride_id`, `amount`, `method`, `status`, `paid_at`, `created_at`) VALUES
(1, 2, 2, NULL, 750.00, 'card', 'completed', '2026-04-28 10:28:54', '2026-04-28 10:28:53'),
(2, 2, 2, NULL, 750.00, 'card', 'completed', '2026-04-28 10:31:05', '2026-04-28 10:31:05');

-- --------------------------------------------------------

--
-- Table structure for table `pricing_logs`
--

DROP TABLE IF EXISTS `pricing_logs`;
CREATE TABLE IF NOT EXISTS `pricing_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `ride_id` int DEFAULT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `final_price` decimal(10,2) NOT NULL,
  `loyalty_discount_pct` int DEFAULT '0',
  `profile_discount_pct` int DEFAULT '0',
  `demand_multiplier` decimal(3,2) DEFAULT '1.00',
  `calculation_logic` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_pricing_logs_user` (`user_id`),
  KEY `fk_pricing_logs_ride` (`ride_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profiles`
--

DROP TABLE IF EXISTS `profiles`;
CREATE TABLE IF NOT EXISTS `profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `user_type` enum('student','employed','tourist','other') COLLATE utf8mb4_general_ci DEFAULT 'other',
  `date_of_birth` date DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `city` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `student_id_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `employment_doc_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `verification_status` enum('unverified','pending','verified','rejected') COLLATE utf8mb4_general_ci DEFAULT 'unverified',
  `completion_pct` int DEFAULT '0',
  `is_eligible_for_ai_pricing` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `idx_profile_eligibility` (`is_eligible_for_ai_pricing`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profiles`
--

INSERT INTO `profiles` (`id`, `user_id`, `user_type`, `date_of_birth`, `address`, `city`, `student_id_url`, `employment_doc_url`, `verification_status`, `completion_pct`, `is_eligible_for_ai_pricing`, `created_at`, `updated_at`) VALUES
(1, 1, 'other', NULL, NULL, NULL, NULL, NULL, 'unverified', 0, 0, '2026-04-16 17:38:20', '2026-04-16 17:38:20'),
(2, 2, 'student', '2004-09-13', 'reghaia', 'Alger', '{}', '{}', 'unverified', 100, 1, '2026-04-16 18:12:07', '2026-04-23 05:29:22'),
(16, 3, 'other', NULL, NULL, NULL, NULL, NULL, 'unverified', 0, 0, '2026-04-30 23:44:48', '2026-04-30 23:44:48');

--
-- Triggers `profiles`
--
DROP TRIGGER IF EXISTS `profile_before_insert`;
DELIMITER $$
CREATE TRIGGER `profile_before_insert` BEFORE INSERT ON `profiles` FOR EACH ROW BEGIN
    DECLARE total_fields INT DEFAULT 5;
    DECLARE filled_fields INT DEFAULT 0;
    
    SET filled_fields = 
        (CASE WHEN NEW.user_type IS NOT NULL AND NEW.user_type != 'other' THEN 1 ELSE 0 END) +
        (CASE WHEN NEW.date_of_birth IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN NEW.address IS NOT NULL AND NEW.address != '' THEN 1 ELSE 0 END) +
        (CASE WHEN NEW.city IS NOT NULL AND NEW.city != '' THEN 1 ELSE 0 END) +
        (CASE 
            WHEN NEW.user_type = 'student' AND NEW.student_id_url IS NOT NULL AND NEW.student_id_url != '' THEN 1 
            WHEN NEW.user_type = 'employed' AND NEW.employment_doc_url IS NOT NULL AND NEW.employment_doc_url != '' THEN 1
            WHEN NEW.user_type = 'tourist' THEN 1
            ELSE 0 
        END);
    
    SET NEW.completion_pct = (filled_fields * 100) / total_fields;
    SET NEW.is_eligible_for_ai_pricing = IF(NEW.completion_pct >= 75, 1, 0);
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `profile_before_update`;
DELIMITER $$
CREATE TRIGGER `profile_before_update` BEFORE UPDATE ON `profiles` FOR EACH ROW BEGIN
    DECLARE total_fields INT DEFAULT 5;
    DECLARE filled_fields INT DEFAULT 0;
    
    SET filled_fields = 
        (CASE WHEN NEW.user_type IS NOT NULL AND NEW.user_type != 'other' THEN 1 ELSE 0 END) +
        (CASE WHEN NEW.date_of_birth IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN NEW.address IS NOT NULL AND NEW.address != '' THEN 1 ELSE 0 END) +
        (CASE WHEN NEW.city IS NOT NULL AND NEW.city != '' THEN 1 ELSE 0 END) +
        (CASE 
            WHEN NEW.user_type = 'student' AND NEW.student_id_url IS NOT NULL AND NEW.student_id_url != '' THEN 1 
            WHEN NEW.user_type = 'employed' AND NEW.employment_doc_url IS NOT NULL AND NEW.employment_doc_url != '' THEN 1
            WHEN NEW.user_type = 'tourist' THEN 1
            ELSE 0 
        END);
    
    SET NEW.completion_pct = (filled_fields * 100) / total_fields;
    SET NEW.is_eligible_for_ai_pricing = IF(NEW.completion_pct >= 75, 1, 0);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `rides`
--

DROP TABLE IF EXISTS `rides`;
CREATE TABLE IF NOT EXISTS `rides` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `vehicle_id` int NOT NULL,
  `start_station_id` int NOT NULL,
  `end_station_id` int DEFAULT NULL,
  `started_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ended_at` timestamp NULL DEFAULT NULL,
  `duration_min` int DEFAULT NULL,
  `base_price` decimal(10,2) DEFAULT NULL,
  `final_price` decimal(10,2) DEFAULT NULL,
  `status` enum('not_started','in_progress','completed','cancelled') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'not_started',
  PRIMARY KEY (`id`),
  KEY `fk_rides_user` (`user_id`),
  KEY `fk_rides_vehicle` (`vehicle_id`),
  KEY `fk_rides_start_station` (`start_station_id`),
  KEY `fk_rides_end_station` (`end_station_id`),
  KEY `idx_rides_user_date` (`user_id`,`started_at`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rides`
--

INSERT INTO `rides` (`id`, `user_id`, `vehicle_id`, `start_station_id`, `end_station_id`, `started_at`, `ended_at`, `duration_min`, `base_price`, `final_price`, `status`) VALUES
(1, 2, 1, 1, 2, '2026-03-19 01:27:36', '2026-03-19 01:52:36', 25, 125.00, 100.00, 'completed'),
(2, 2, 2, 2, 1, '2026-03-20 09:27:36', '2026-03-20 10:02:36', 35, 280.00, 224.00, 'completed'),
(3, 2, 1, 1, 3, '2026-03-21 01:27:36', '2026-03-21 01:47:36', 20, 100.00, 80.00, 'completed'),
(4, 2, 3, 3, 1, '2026-03-22 10:27:36', '2026-03-22 10:57:36', 30, 300.00, 240.00, 'completed'),
(5, 2, 2, 1, 2, '2026-03-23 02:27:36', '2026-03-23 02:49:36', 22, 176.00, 141.00, 'completed'),
(6, 2, 3, 2, 4, '2026-03-24 07:27:36', '2026-03-24 08:12:36', 45, 450.00, 382.00, 'completed'),
(7, 2, 1, 4, 1, '2026-03-25 11:27:36', '2026-03-25 11:55:36', 28, 140.00, 112.00, 'completed'),
(8, 2, 2, 1, 3, '2026-03-28 01:27:36', '2026-03-28 01:59:36', 32, 256.00, 205.00, 'completed'),
(9, 2, 1, 3, 2, '2026-03-29 10:27:36', '2026-03-29 10:45:36', 18, 90.00, 72.00, 'completed'),
(10, 2, 3, 2, 1, '2026-03-30 03:27:36', '2026-03-30 04:07:36', 40, 400.00, 320.00, 'completed'),
(11, 2, 2, 1, 2, '2026-04-04 01:28:54', '2026-04-04 01:53:54', 25, 200.00, 160.00, 'completed'),
(12, 2, 1, 2, 3, '2026-04-05 09:28:54', '2026-04-05 09:58:54', 30, 150.00, 120.00, 'completed'),
(13, 2, 3, 1, 4, '2026-04-11 02:28:54', '2026-04-11 03:03:54', 35, 350.00, 280.00, 'completed'),
(14, 2, 2, 4, 1, '2026-04-12 11:28:54', '2026-04-12 11:56:54', 28, 224.00, 179.00, 'completed'),
(15, 2, 1, 3, 2, '2026-04-16 08:28:54', '2026-04-16 08:50:54', 22, 110.00, 88.00, 'completed'),
(16, 2, 3, 2, NULL, '2026-04-17 04:28:54', NULL, NULL, NULL, NULL, 'cancelled'),
(17, 2, 2, 1, NULL, '2026-04-17 17:28:54', NULL, NULL, NULL, NULL, 'in_progress');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('hDcOCXX8n3jBGPA29okXBUvWTpYw3DIb', 1778197489, '{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2026-05-07T23:44:48.778Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"userId\":2,\"role\":\"user\",\"user\":{\"id\":3,\"full_name\":\"houssem\",\"email\":\"houssem2@1.com\",\"role\":\"user\"}}');

-- --------------------------------------------------------

--
-- Table structure for table `stations`
--

DROP TABLE IF EXISTS `stations`;
CREATE TABLE IF NOT EXISTS `stations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `address` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `total_slots` int NOT NULL,
  `available_slots` int NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stations`
--

INSERT INTO `stations` (`id`, `name`, `address`, `latitude`, `longitude`, `total_slots`, `available_slots`, `is_active`) VALUES
(1, 'Université Boumerdes', 'Campus Universitaire, Boumerdes', 36.75000000, 3.47000000, 20, 12, 1),
(2, 'Gare d\'Alger', 'Place du 1er Mai, Alger', 36.77000000, 3.05000000, 30, 8, 1),
(3, 'Centre-Ville', 'Rue Didouche Mourad, Alger', 36.73000000, 3.08000000, 25, 15, 1),
(4, 'Aéroport Houari Boumediene', 'Terminal 1, Alger', 36.69000000, 3.21000000, 40, 22, 1);

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `period` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `title`, `price`, `period`, `description`, `created_at`) VALUES
(1, 'Horaire', 200.00, '/heure', 'Idéal pour les courts trajets', '2026-04-28 10:24:23'),
(2, 'Journalier', 750.00, '/jour', 'Parfait pour une journée d\'exploration', '2026-04-28 10:24:23'),
(3, 'Mensuel', 5000.00, '/mois', 'Pour les trajets quotidiens', '2026-04-28 10:24:23'),
(4, 'Annuel', 40000.00, '/an', 'L\'offre la plus avantageuse', '2026-04-28 10:24:23');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('admin','user') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `reset_token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password_hash`, `role`, `created_at`, `is_active`, `reset_token`, `reset_token_expires`) VALUES
(1, 'houssem', 'admin@internship.com', '0123456789', '$2b$12$2IVYCZi0QEnGzviSYjpDdu5C6/xHvWC.4qQsDc/VyY7/KNo2Qp75K', 'user', '2026-04-16 17:38:20', 1, NULL, NULL),
(2, 'houssem', 'houssem@1.com', '0123456789', '$2b$12$robG3gfdjyPrK2yoShQ0uOx39K2lNGwDx.cy9p9ksrV7EzqEzgyAa', 'user', '2026-04-16 18:12:07', 1, NULL, NULL),
(3, 'houssem', 'houssem2@1.com', '1234567890', '$2b$12$ZQsIM2EtRwHxm.n80OjVEeMSC4DKkKcWQnSTDAd/a1.fJ3tpFDMbO', 'user', '2026-04-30 23:44:48', 1, NULL, NULL);

--
-- Triggers `users`
--
DROP TRIGGER IF EXISTS `auto_create_profile_on_user_insert`;
DELIMITER $$
CREATE TRIGGER `auto_create_profile_on_user_insert` AFTER INSERT ON `users` FOR EACH ROW BEGIN
    IF NEW.role = 'user' THEN
        INSERT INTO `profiles` (`user_id`, `user_type`, `verification_status`)
        VALUES (NEW.id, 'other', 'unverified');
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
CREATE TABLE IF NOT EXISTS `vehicles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `type` enum('scooter','bicycle','electric bicycle') COLLATE utf8mb4_general_ci NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `station_id` int DEFAULT NULL,
  `battery_level` int NOT NULL DEFAULT '100',
  `status` enum('available','reserved','in_use','under_maintenance') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'available',
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `last_seen_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `fk_station` (`station_id`),
  KEY `idx_vehicles_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`id`, `code`, `type`, `price`, `station_id`, `battery_level`, `status`, `latitude`, `longitude`, `last_seen_at`) VALUES
(1, 'VH-0001', 'bicycle', 100, 1, 100, 'available', 36.75000000, 36.00000000, '2026-04-17 16:05:27'),
(2, 'VH-0002', 'electric bicycle', 2000, 1, 85, 'available', 36.75000000, 3.47000000, '2026-04-17 19:07:22'),
(3, 'VH-0003', 'scooter', 300, 2, 60, 'available', 36.77000000, 3.05000000, '2026-04-17 16:05:27'),
(4, 'VH-0004', 'bicycle', 100, 3, 100, 'available', 36.73000000, 3.08000000, '2026-04-17 16:05:27'),
(5, 'VH-0005', 'electric bicycle', 200, 4, 45, 'available', 36.69000000, 3.21000000, '2026-04-17 16:05:27');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_types`
--

DROP TABLE IF EXISTS `vehicle_types`;
CREATE TABLE IF NOT EXISTS `vehicle_types` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `available` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vehicle_types`
--

INSERT INTO `vehicle_types` (`id`, `title`, `image`, `type`, `base_price`, `available`, `created_at`) VALUES
(1, 'Vélo Électrique Standard', 'bike-electric-1.jpg', 'electric', 15.00, 1, '2026-04-16 19:55:27'),
(2, 'Vélo Électrique Standard', 'bike-electric-1.jpg', 'electric', 15.00, 1, '2026-04-16 19:55:27'),
(3, 'Vélo Classique', 'bike-classic-1.jpg', 'classic', 8.00, 1, '2026-04-16 19:55:27'),
(4, 'Vélo Classique', 'bike-classic-1.jpg', 'classic', 8.00, 1, '2026-04-16 19:55:27'),
(5, 'VTT Électrique', 'bike-mountain-1.jpg', 'electric', 20.00, 1, '2026-04-16 19:55:27'),
(6, 'VTT Électrique', 'bike-mountain-1.jpg', 'electric', 20.00, 1, '2026-04-16 19:55:27'),
(7, 'Vélo de Ville', 'bike-city-1.jpg', 'classic', 10.00, 1, '2026-04-16 19:55:27'),
(8, 'Vélo de Ville', 'bike-city-1.jpg', 'classic', 10.00, 1, '2026-04-16 19:55:27'),
(9, 'Vélo Cargo Électrique', 'bike-cargo-1.jpg', 'electric', 25.00, 1, '2026-04-16 19:55:27'),
(10, 'Vélo Cargo Électrique', 'bike-cargo-1.jpg', 'electric', 25.00, 1, '2026-04-16 19:55:27'),
(11, 'Trottinette Électrique', 'scooter-1.jpg', 'scooter', 12.00, 1, '2026-04-16 19:55:27'),
(12, 'Trottinette Électrique', 'scooter-1.jpg', 'scooter', 12.00, 1, '2026-04-16 19:55:27');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `gps_logs`
--
ALTER TABLE `gps_logs`
  ADD CONSTRAINT `fk_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `maintenance`
--
ALTER TABLE `maintenance`
  ADD CONSTRAINT `fk_maintenance` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pricing_logs`
--
ALTER TABLE `pricing_logs`
  ADD CONSTRAINT `fk_pricing_logs_ride` FOREIGN KEY (`ride_id`) REFERENCES `rides` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_pricing_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `profiles`
--
ALTER TABLE `profiles`
  ADD CONSTRAINT `fk_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rides`
--
ALTER TABLE `rides`
  ADD CONSTRAINT `fk_rides_end_station` FOREIGN KEY (`end_station_id`) REFERENCES `stations` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_rides_start_station` FOREIGN KEY (`start_station_id`) REFERENCES `stations` (`id`),
  ADD CONSTRAINT `fk_rides_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_rides_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`);

--
-- Constraints for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `fk_station` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
