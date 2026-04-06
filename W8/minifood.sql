-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.44 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table mini_food.foods
CREATE TABLE IF NOT EXISTS `foods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `price` double NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table mini_food.foods: ~5 rows (approximately)
REPLACE INTO `foods` (`id`, `name`, `price`, `description`) VALUES
	(1, 'Cơm Tấm Sườn Bì Chả', 45000, 'Cơm tấm truyền thống, sườn nướng mật ong'),
	(2, 'Bún Chả Hà Nội', 50000, 'Bún chả nướng than hoa, kèm nem chua'),
	(3, 'Phở Bò Tái Lăn', 55000, 'Phở bò gia truyền, nước dùng đậm đà'),
	(4, 'Trà Sữa Full Topping', 35000, 'Trà sữa Đài Loan, trân chân đen, thạch'),
	(5, 'Pizza Hải Sản', 120000, 'Pizza đế mỏng, tôm, mực, phô mai Mozzarella');

-- Dumping structure for table mini_food.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `total_price` double DEFAULT NULL,
  `status` varchar(50) DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table mini_food.orders: ~2 rows (approximately)
REPLACE INTO `orders` (`id`, `user_id`, `total_price`, `status`, `created_at`) VALUES
	(1, 2, 80000, 'PAID', '2026-04-06 11:32:30'),
	(2, 2, 120000, 'PENDING', '2026-04-06 11:32:30');

-- Dumping structure for table mini_food.order_items
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `food_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table mini_food.order_items: ~3 rows (approximately)
REPLACE INTO `order_items` (`id`, `order_id`, `food_id`, `quantity`, `price`) VALUES
	(1, 1, 1, 1, 45000),
	(2, 1, 4, 1, 35000),
	(3, 2, 5, 1, 120000);

-- Dumping structure for table mini_food.payments
CREATE TABLE IF NOT EXISTS `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `method` varchar(50) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `payment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table mini_food.payments: ~1 rows (approximately)
REPLACE INTO `payments` (`id`, `order_id`, `method`, `amount`, `payment_date`) VALUES
	(1, 1, 'BANKING', 80000, '2026-04-06 11:32:30');

-- Dumping structure for table mini_food.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'USER',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table mini_food.users: ~3 rows (approximately)
REPLACE INTO `users` (`id`, `username`, `password`, `role`) VALUES
	(1, 'admin_dong', 'admin123', 'ADMIN'),
	(2, 'customer_01', 'user123', 'USER'),
	(3, 'customer_02', 'user123', 'USER');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
