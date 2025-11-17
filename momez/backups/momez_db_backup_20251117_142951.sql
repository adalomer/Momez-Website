-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: momez_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `user_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_line1` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_line2` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `district` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `postal_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Türkiye',
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_default` (`user_id`,`is_default`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaigns`
--

DROP TABLE IF EXISTS `campaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaigns` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discount_type` enum('percentage','fixed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'percentage',
  `discount_value` decimal(10,2) NOT NULL,
  `start_date` timestamp NOT NULL,
  `end_date` timestamp NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_slug` (`slug`),
  KEY `idx_active` (`is_active`),
  KEY `idx_dates` (`start_date`,`end_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaigns`
--

LOCK TABLES `campaigns` WRITE;
/*!40000 ALTER TABLE `campaigns` DISABLE KEYS */;
/*!40000 ALTER TABLE `campaigns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `user_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_product_size` (`user_id`,`product_id`,`size`),
  KEY `product_id` (`product_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES ('c7a663e8-c3a5-11f0-a55c-9a6da8592af0','180a725b-c351-11f0-a70f-0e5f7ebbeeec','prod-003','44',1,'2025-11-17 11:08:43','2025-11-17 11:08:43');
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_slug` (`slug`),
  KEY `idx_active` (`is_active`),
  KEY `idx_parent` (`parent_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('149289f9-c3a0-11f0-aa68-9adb321602ef','Kadın Ayakkabı','kadin-ayakkabi',NULL,'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop',NULL,2,1,'2025-11-17 10:27:55','2025-11-17 10:30:57'),('1499ca12-c3a0-11f0-aa68-9adb321602ef','Sneaker','sneaker','Sneaker ve gÃ¼nlÃ¼k ayakkabÄ±lar','https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop',NULL,5,1,'2025-11-17 10:27:55','2025-11-17 10:27:55'),('1499cb2e-c3a0-11f0-aa68-9adb321602ef','Bot & Postal','bot-postal','Bot ve postal modelleri','https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&h=800&fit=crop',NULL,6,1,'2025-11-17 10:27:55','2025-11-17 10:27:55'),('1499cc08-c3a0-11f0-aa68-9adb321602ef','Klasik Ayakkabı','klasik-ayakkabi',NULL,'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&h=800&fit=crop',NULL,7,1,'2025-11-17 10:27:55','2025-11-17 10:30:44'),('1499cd9c-c3a0-11f0-aa68-9adb321602ef','Sandalet & Terlik','sandalet-terlik','Sandalet ve terlik modelleri','https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&h=800&fit=crop',NULL,8,1,'2025-11-17 10:27:55','2025-11-17 10:27:55'),('1499ce7a-c3a0-11f0-aa68-9adb321602ef','Topuklu AyakkabÄ±','topuklu-ayakkabi','Topuklu ayakkabÄ± modelleri','https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop',NULL,9,1,'2025-11-17 10:27:55','2025-11-17 10:27:55'),('1499cf3a-c3a0-11f0-aa68-9adb321602ef','kadın spor','kadin-spor',NULL,'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&h=800&fit=crop',NULL,10,1,'2025-11-17 10:27:55','2025-11-17 10:30:31'),('f217b45d-c336-11f0-8426-56042ea1cd39','Erkek Ayakkabı','erkek','Erkek ayakkabı modelleri','https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=800&fit=crop',NULL,0,1,'2025-11-16 21:55:20','2025-11-17 10:30:02'),('f217b8b7-c336-11f0-8426-56042ea1cd39','Kadın Ayakkabı','kadin','Kadın ayakkabı modelleri','https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop',NULL,0,1,'2025-11-16 21:55:20','2025-11-17 10:30:02'),('f217baf9-c336-11f0-8426-56042ea1cd39','Ã‡ocuk AyakkabÄ±','cocuk-ayakkabi',NULL,'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=800&fit=crop',NULL,0,1,'2025-11-16 21:55:20','2025-11-17 10:30:02'),('f217bbd3-c336-11f0-8426-56042ea1cd39','Spor Ayakkabı','spor','Spor ayakkabı modelleri','https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop',NULL,0,1,'2025-11-16 21:55:20','2025-11-17 10:30:02');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `user_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_product` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `low_stock_products`
--

DROP TABLE IF EXISTS `low_stock_products`;
/*!50001 DROP VIEW IF EXISTS `low_stock_products`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `low_stock_products` AS SELECT 
 1 AS `id`,
 1 AS `name`,
 1 AS `size`,
 1 AS `quantity`,
 1 AS `is_active`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES ('4d9f228c-c848-49a6-b590-83557aed63db','cd10300c-84c0-4550-b778-398cb03bbaa7','a7d4830b-c363-11f0-a70f-0e5f7ebbeeec','aaa','39',1,100.00,'2025-11-17 04:35:27'),('781b4ee7-2ca8-4da9-80a6-f1bfe0636f51','3ed4c318-45de-4ce6-83e6-bd2bdeec6d07','a7d4830b-c363-11f0-a70f-0e5f7ebbeeec','aaa','40',1,100.00,'2025-11-17 04:44:36'),('a2f5ab7d-afce-4b42-9c6b-59afc5067d85','e08b3c53-2fe0-430b-b34a-2ca6d3344f40','a7d4830b-c363-11f0-a70f-0e5f7ebbeeec','aaa','38',1,100.00,'2025-11-17 07:58:53'),('b4a68fc6-9a6e-494f-a8ec-302792fe4d1d','e97e7a6b-c0d9-427b-a3ad-a353f5f331b4','prod-007','Converse Chuck 70','40',1,1299.00,'2025-11-17 10:54:03'),('c263e661-9915-462b-ae1f-ad05e09f2aae','1cfae918-bb17-44da-af46-4e401e76491c','prod-001','Nike Air Max 90','42',2,2499.00,'2025-11-17 11:21:15'),('e81bc509-5712-4510-9ade-afd53c182696','1100425e-f4d1-4615-beec-e081aa575b7e','a7d4830b-c363-11f0-a70f-0e5f7ebbeeec','aaa','39',1,100.00,'2025-11-17 04:39:27');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `order_statistics`
--

DROP TABLE IF EXISTS `order_statistics`;
/*!50001 DROP VIEW IF EXISTS `order_statistics`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `order_statistics` AS SELECT 
 1 AS `order_date`,
 1 AS `total_orders`,
 1 AS `total_revenue`,
 1 AS `average_order_value`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_method` enum('card','cash_on_delivery') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `shipping_cost` decimal(10,2) DEFAULT '0.00',
  `total` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','preparing','shipped','delivered','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_order_number` (`order_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('1100425e-f4d1-4615-beec-e081aa575b7e','180a725b-c351-11f0-a70f-0e5f7ebbeeec','OR-20251117-1863','dffe397c-6271-4b23-91bf-18b787046a4d','cash_on_delivery',100.00,50.00,150.00,'delivered',NULL,'2025-11-17 04:39:27','2025-11-17 07:56:48'),('1cfae918-bb17-44da-af46-4e401e76491c','e38f32cc-c34b-11f0-bf96-0e7582445334','OR-20251117-7205','4a9caac3-7af9-4cac-893c-5ba1d7b1054b','cash_on_delivery',4998.00,0.00,4998.00,'delivered','ewew','2025-11-17 11:21:15','2025-11-17 11:24:35'),('3ed4c318-45de-4ce6-83e6-bd2bdeec6d07','180a725b-c351-11f0-a70f-0e5f7ebbeeec','OR-20251117-6634','dffe397c-6271-4b23-91bf-18b787046a4d','cash_on_delivery',100.00,50.00,150.00,'cancelled',NULL,'2025-11-17 04:44:36','2025-11-17 10:54:53'),('cd10300c-84c0-4550-b778-398cb03bbaa7','180a725b-c351-11f0-a70f-0e5f7ebbeeec','OR-20251117-4518','dffe397c-6271-4b23-91bf-18b787046a4d','cash_on_delivery',100.00,50.00,150.00,'pending',NULL,'2025-11-17 04:35:27','2025-11-17 04:35:27'),('e08b3c53-2fe0-430b-b34a-2ca6d3344f40','180a725b-c351-11f0-a70f-0e5f7ebbeeec','OR-20251117-5150','dffe397c-6271-4b23-91bf-18b787046a4d','cash_on_delivery',100.00,50.00,150.00,'cancelled',NULL,'2025-11-17 07:58:53','2025-11-17 11:24:19'),('e97e7a6b-c0d9-427b-a3ad-a353f5f331b4','e38f32cc-c34b-11f0-bf96-0e7582445334','OR-20251117-6704','3d6fa87f-b0d3-4924-b9d6-003c0d169cf0','cash_on_delivery',1299.00,0.00,1299.00,'delivered','asdasdadsasd','2025-11-17 10:54:03','2025-11-17 10:54:50');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `product_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt_text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `is_primary` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product` (`product_id`),
  KEY `idx_primary` (`product_id`,`is_primary`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES ('ad119bc5-c3a7-11f0-a55c-9a6da8592af0','prod-001','https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',NULL,0,1,'2025-11-17 11:22:17'),('c8d5a05c-c3a7-11f0-a55c-9a6da8592af0','c8d38b9d-c3a7-11f0-a55c-9a6da8592af0','/uploads/1763378573906_ChatGPT_Image_7_Haz_2025_14_34_00.png',NULL,0,1,'2025-11-17 11:23:04'),('d8203495-c39c-11f0-b61f-724359037209','prod-002','https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=800&fit=crop','Adidas Ultraboost 22',1,1,'2025-11-17 10:04:45'),('d820361a-c39c-11f0-b61f-724359037209','prod-003','https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop','Puma RS-X',1,1,'2025-11-17 10:04:45'),('d82036a8-c39c-11f0-b61f-724359037209','prod-004','https://images.unsplash.com/photo-1574097656146-0b43b7660cb6?w=800&h=800&fit=crop','New Balance 574',1,1,'2025-11-17 10:04:45'),('d8203714-c39c-11f0-b61f-724359037209','prod-005','https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop','Nike Air Force 1 Low',1,1,'2025-11-17 10:04:45'),('d8203782-c39c-11f0-b61f-724359037209','prod-006','https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&h=800&fit=crop','Adidas Stan Smith',1,1,'2025-11-17 10:04:45'),('d8203856-c39c-11f0-b61f-724359037209','prod-008','https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&h=800&fit=crop','Vans Old Skool Platform',1,1,'2025-11-17 10:04:45'),('d820393b-c39c-11f0-b61f-724359037209','prod-009','https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&h=800&fit=crop','Nike Air Max 90 Kids',1,1,'2025-11-17 10:04:45'),('d820399b-c39c-11f0-b61f-724359037209','prod-010','https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&h=800&fit=crop','Adidas Superstar Kids',1,1,'2025-11-17 10:04:45'),('d82039fa-c39c-11f0-b61f-724359037209','prod-011','https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop','Nike Pegasus 40',1,1,'2025-11-17 10:04:45'),('d8203a59-c39c-11f0-b61f-724359037209','prod-012','https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&h=800&fit=crop','Asics Gel-Kayano 30',1,1,'2025-11-17 10:04:45'),('e6249e2b-c39e-11f0-b61f-724359037209','prod-007','https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&h=800&fit=crop',NULL,0,1,'2025-11-17 10:19:28');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_stock`
--

DROP TABLE IF EXISTS `product_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_stock` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `product_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `reserved_quantity` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_product_size` (`product_id`,`size`),
  KEY `idx_product` (`product_id`),
  KEY `idx_quantity` (`quantity`),
  CONSTRAINT `product_stock_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_stock`
--

LOCK TABLES `product_stock` WRITE;
/*!40000 ALTER TABLE `product_stock` DISABLE KEYS */;
INSERT INTO `product_stock` VALUES ('ad131c92-c3a7-11f0-a55c-9a6da8592af0','prod-001','36',0,0,'2025-11-17 11:22:17','2025-11-17 11:22:17'),('ad13d154-c3a7-11f0-a55c-9a6da8592af0','prod-001','37',0,0,'2025-11-17 11:22:17','2025-11-17 11:22:17'),('ad14a6f1-c3a7-11f0-a55c-9a6da8592af0','prod-001','38',2,0,'2025-11-17 11:22:17','2025-11-17 11:22:17'),('ad15686c-c3a7-11f0-a55c-9a6da8592af0','prod-001','39',0,0,'2025-11-17 11:22:17','2025-11-17 11:22:17'),('ad163a93-c3a7-11f0-a55c-9a6da8592af0','prod-001','40',25,0,'2025-11-17 11:22:17','2025-11-17 11:22:17'),('ad17019f-c3a7-11f0-a55c-9a6da8592af0','prod-001','41',30,0,'2025-11-17 11:22:17','2025-11-17 11:22:17'),('ad17a462-c3a7-11f0-a55c-9a6da8592af0','prod-001','42',23,0,'2025-11-17 11:22:17','2025-11-17 11:22:17'),('ad184305-c3a7-11f0-a55c-9a6da8592af0','prod-001','43',20,0,'2025-11-17 11:22:17','2025-11-17 11:22:17'),('ad18ea54-c3a7-11f0-a55c-9a6da8592af0','prod-001','44',15,0,'2025-11-17 11:22:17','2025-11-17 11:22:17'),('ad19be8c-c3a7-11f0-a55c-9a6da8592af0','prod-001','45',0,0,'2025-11-17 11:22:17','2025-11-17 11:22:17'),('ad1a98f4-c3a7-11f0-a55c-9a6da8592af0','prod-001','46',0,0,'2025-11-17 11:22:17','2025-11-17 11:22:17'),('c8d693b5-c3a7-11f0-a55c-9a6da8592af0','c8d38b9d-c3a7-11f0-a55c-9a6da8592af0','38',49,0,'2025-11-17 11:23:04','2025-11-17 11:23:04'),('c8d78069-c3a7-11f0-a55c-9a6da8592af0','c8d38b9d-c3a7-11f0-a55c-9a6da8592af0','39',6,0,'2025-11-17 11:23:04','2025-11-17 11:23:04'),('c8d83a9e-c3a7-11f0-a55c-9a6da8592af0','c8d38b9d-c3a7-11f0-a55c-9a6da8592af0','40',4,0,'2025-11-17 11:23:04','2025-11-17 11:23:04'),('c8d8d790-c3a7-11f0-a55c-9a6da8592af0','c8d38b9d-c3a7-11f0-a55c-9a6da8592af0','41',3,0,'2025-11-17 11:23:04','2025-11-17 11:23:04'),('c8d96e20-c3a7-11f0-a55c-9a6da8592af0','c8d38b9d-c3a7-11f0-a55c-9a6da8592af0','42',0,0,'2025-11-17 11:23:04','2025-11-17 11:23:04'),('e21f787e-c39c-11f0-b61f-724359037209','prod-002','40',20,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f78fe-c39c-11f0-b61f-724359037209','prod-002','41',25,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f7989-c39c-11f0-b61f-724359037209','prod-002','42',30,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f7af6-c39c-11f0-b61f-724359037209','prod-002','43',20,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f7b83-c39c-11f0-b61f-724359037209','prod-002','44',10,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f7c04-c39c-11f0-b61f-724359037209','prod-003','40',15,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f7c82-c39c-11f0-b61f-724359037209','prod-003','41',20,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f7d08-c39c-11f0-b61f-724359037209','prod-003','42',20,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f7d92-c39c-11f0-b61f-724359037209','prod-003','43',15,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f7e10-c39c-11f0-b61f-724359037209','prod-003','44',10,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f7e8c-c39c-11f0-b61f-724359037209','prod-004','40',20,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f7f0d-c39c-11f0-b61f-724359037209','prod-004','41',25,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f7f94-c39c-11f0-b61f-724359037209','prod-004','42',25,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f8020-c39c-11f0-b61f-724359037209','prod-004','43',15,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f80f6-c39c-11f0-b61f-724359037209','prod-004','44',10,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f81ad-c39c-11f0-b61f-724359037209','prod-005','36',20,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f8234-c39c-11f0-b61f-724359037209','prod-005','37',25,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f82b2-c39c-11f0-b61f-724359037209','prod-005','38',30,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f832c-c39c-11f0-b61f-724359037209','prod-005','39',25,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f83a8-c39c-11f0-b61f-724359037209','prod-005','40',15,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f8422-c39c-11f0-b61f-724359037209','prod-006','36',15,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f849e-c39c-11f0-b61f-724359037209','prod-006','37',20,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f8518-c39c-11f0-b61f-724359037209','prod-006','38',25,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f8591-c39c-11f0-b61f-724359037209','prod-006','39',20,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f860d-c39c-11f0-b61f-724359037209','prod-006','40',10,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f88fc-c39c-11f0-b61f-724359037209','prod-008','36',10,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f8977-c39c-11f0-b61f-724359037209','prod-008','37',15,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f89f2-c39c-11f0-b61f-724359037209','prod-008','38',20,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f8a6f-c39c-11f0-b61f-724359037209','prod-008','39',15,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f8aeb-c39c-11f0-b61f-724359037209','prod-008','40',10,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f8b69-c39c-11f0-b61f-724359037209','prod-009','30',20,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f8be8-c39c-11f0-b61f-724359037209','prod-009','31',25,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f8c64-c39c-11f0-b61f-724359037209','prod-009','32',25,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f8ce1-c39c-11f0-b61f-724359037209','prod-009','33',20,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f8d5c-c39c-11f0-b61f-724359037209','prod-009','34',15,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f8ddb-c39c-11f0-b61f-724359037209','prod-010','30',15,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f8e58-c39c-11f0-b61f-724359037209','prod-010','31',20,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f8ed3-c39c-11f0-b61f-724359037209','prod-010','32',20,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f8f52-c39c-11f0-b61f-724359037209','prod-010','33',15,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f8fd0-c39c-11f0-b61f-724359037209','prod-010','34',10,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f904e-c39c-11f0-b61f-724359037209','prod-011','40',15,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f90cf-c39c-11f0-b61f-724359037209','prod-011','41',20,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f914f-c39c-11f0-b61f-724359037209','prod-011','42',25,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f91cc-c39c-11f0-b61f-724359037209','prod-011','43',15,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f924b-c39c-11f0-b61f-724359037209','prod-011','44',10,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f92c8-c39c-11f0-b61f-724359037209','prod-012','40',10,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f9343-c39c-11f0-b61f-724359037209','prod-012','41',15,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f93c1-c39c-11f0-b61f-724359037209','prod-012','42',20,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f9444-c39c-11f0-b61f-724359037209','prod-012','43',15,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e21f94c4-c39c-11f0-b61f-724359037209','prod-012','44',10,0,'2025-11-17 10:05:02','2025-11-17 10:05:02'),('e6273cb8-c39e-11f0-b61f-724359037209','prod-007','36',0,0,'2025-11-17 10:19:28','2025-11-17 10:19:28'),('e62889f9-c39e-11f0-b61f-724359037209','prod-007','37',0,0,'2025-11-17 10:19:28','2025-11-17 10:19:28'),('e629b6f5-c39e-11f0-b61f-724359037209','prod-007','38',0,0,'2025-11-17 10:19:28','2025-11-17 10:19:28'),('e62b3cf2-c39e-11f0-b61f-724359037209','prod-007','39',0,0,'2025-11-17 10:19:28','2025-11-17 10:19:28'),('e62c7ca0-c39e-11f0-b61f-724359037209','prod-007','40',4,0,'2025-11-17 10:19:28','2025-11-17 10:54:03'),('e62e11d8-c39e-11f0-b61f-724359037209','prod-007','41',0,0,'2025-11-17 10:19:28','2025-11-17 10:19:28'),('e62f7a68-c39e-11f0-b61f-724359037209','prod-007','42',0,0,'2025-11-17 10:19:28','2025-11-17 10:19:28'),('e630b1dc-c39e-11f0-b61f-724359037209','prod-007','43',0,0,'2025-11-17 10:19:28','2025-11-17 10:19:28'),('e631eda2-c39e-11f0-b61f-724359037209','prod-007','44',0,0,'2025-11-17 10:19:28','2025-11-17 10:19:28'),('e6336476-c39e-11f0-b61f-724359037209','prod-007','45',0,0,'2025-11-17 10:19:28','2025-11-17 10:19:28'),('e634ceb2-c39e-11f0-b61f-724359037209','prod-007','46',0,0,'2025-11-17 10:19:28','2025-11-17 10:19:28');
/*!40000 ALTER TABLE `product_stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `compare_at_price` decimal(10,2) DEFAULT NULL,
  `cost_price` decimal(10,2) DEFAULT NULL,
  `sku` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_featured` tinyint(1) DEFAULT '0',
  `is_new` tinyint(1) DEFAULT '0',
  `tags` json DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `sku` (`sku`),
  KEY `idx_slug` (`slug`),
  KEY `idx_category` (`category_id`),
  KEY `idx_active` (`is_active`),
  KEY `idx_featured` (`is_featured`),
  KEY `idx_price` (`price`),
  FULLTEXT KEY `idx_search` (`name`,`description`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('c8d38b9d-c3a7-11f0-a55c-9a6da8592af0','nike pro','nike-pro','best shoes',566.99,NULL,NULL,NULL,NULL,'1499cc08-c3a0-11f0-aa68-9adb321602ef',NULL,1,0,0,NULL,NULL,'2025-11-17 11:23:04','2025-11-17 11:23:04'),('prod-001','Nike Air Max 90','nike-air-max-90','Klasik ve konforlu spor ayakkabÄ±. Hava yastÄ±klÄ± taban teknolojisi ile Ã¼stÃ¼n konfor saÄŸlar.',2498.99,NULL,2999.00,NULL,NULL,'f217b45d-c336-11f0-8426-56042ea1cd39','Nike',1,1,0,NULL,NULL,'2025-11-17 10:04:25','2025-11-17 11:22:17'),('prod-002','Adidas Ultraboost 22','adidas-ultraboost-22','YÃ¼ksek performanslÄ± koÅŸu ayakkabÄ±sÄ±. Boost teknolojisi ile maksimum enerji geri dÃ¶nÃ¼ÅŸÃ¼.',3299.00,NULL,3799.00,NULL,NULL,'f217b45d-c336-11f0-8426-56042ea1cd39','Adidas',1,1,0,NULL,NULL,'2025-11-17 10:04:25','2025-11-17 10:04:25'),('prod-003','Puma RS-X','puma-rs-x','Retro tasarÄ±m ve modern konforun buluÅŸmasÄ±. GÃ¼nlÃ¼k kullanÄ±m iÃ§in ideal.',1899.00,NULL,2299.00,NULL,NULL,'f217b45d-c336-11f0-8426-56042ea1cd39','Puma',1,0,0,NULL,NULL,'2025-11-17 10:04:25','2025-11-17 10:04:25'),('prod-004','New Balance 574','new-balance-574','ZamansÄ±z klasik tasarÄ±m. Her kombinle uyumlu rahat ayakkabÄ±.',1699.00,NULL,NULL,NULL,NULL,'f217b45d-c336-11f0-8426-56042ea1cd39','New Balance',0,0,0,NULL,NULL,'2025-11-17 10:04:25','2025-11-17 10:51:05'),('prod-005','Nike Air Force 1 Low','nike-air-force-1-low','Ä°konik tasarÄ±m ve stil. Her kÄ±yafete uygun beyaz spor ayakkabÄ±.',2199.00,NULL,2599.00,NULL,NULL,'f217b8b7-c336-11f0-8426-56042ea1cd39','Nike',1,1,0,NULL,NULL,'2025-11-17 10:04:25','2025-11-17 10:04:25'),('prod-006','Adidas Stan Smith','adidas-stan-smith','Minimalist ve ÅŸÄ±k tasarÄ±m. GÃ¼nlÃ¼k kulanÄ±m iÃ§in mÃ¼kemmel.',1899.00,NULL,NULL,NULL,NULL,'f217b8b7-c336-11f0-8426-56042ea1cd39','Adidas',1,1,0,NULL,NULL,'2025-11-17 10:04:25','2025-11-17 10:04:25'),('prod-007','Converse Chuck 70','converse-chuck-70','Vintage tarz ve konfor. Premium kanvas malzeme.',1299.00,NULL,1499.00,NULL,NULL,'f217b8b7-c336-11f0-8426-56042ea1cd39','Converse',1,0,0,NULL,NULL,'2025-11-17 10:04:25','2025-11-17 10:04:25'),('prod-008','Vans Old Skool Platform','vans-old-skool-platform','Klasik Vans tasarÄ±mÄ± platform tabanla. YÃ¼kseklik ve stil birlikte.',1599.00,NULL,NULL,NULL,NULL,'f217b8b7-c336-11f0-8426-56042ea1cd39','Vans',1,0,0,NULL,NULL,'2025-11-17 10:04:25','2025-11-17 10:04:25'),('prod-009','Nike Air Max 90 Kids','nike-air-max-90-kids','Ã‡ocuklar iÃ§in renkli ve rahat spor ayakkabÄ±. DayanÄ±klÄ± yapÄ±.',1299.00,NULL,1599.00,NULL,NULL,'f217baf9-c336-11f0-8426-56042ea1cd39','Nike',1,1,0,NULL,NULL,'2025-11-17 10:04:25','2025-11-17 10:04:25'),('prod-010','Adidas Superstar Kids','adidas-superstar-kids','Klasik shell toe tasarÄ±m Ã§ocuklar iÃ§in. Rahat ve ÅŸÄ±k.',999.00,NULL,NULL,NULL,NULL,'f217baf9-c336-11f0-8426-56042ea1cd39','Adidas',1,0,0,NULL,NULL,'2025-11-17 10:04:25','2025-11-17 10:04:25'),('prod-011','Nike Pegasus 40','nike-pegasus-40','KoÅŸu iÃ§in profesyonel ayakkabÄ±. Hafif ve hÄ±zlÄ±.',2899.00,NULL,3299.00,NULL,NULL,'f217bbd3-c336-11f0-8426-56042ea1cd39','Nike',1,1,0,NULL,NULL,'2025-11-17 10:04:25','2025-11-17 10:04:25'),('prod-012','Asics Gel-Kayano 30','asics-gel-kayano-30','Uzun mesafe koÅŸusu iÃ§in ideal. ÃœstÃ¼n destek ve yastÄ±klama.',3499.00,NULL,3999.00,NULL,NULL,'f217bbd3-c336-11f0-8426-56042ea1cd39','Asics',1,1,0,NULL,NULL,'2025-11-17 10:04:25','2025-11-17 10:04:25');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `key` varchar(255) NOT NULL,
  `value` text,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES ('address','İstanbul, Türkiye','2025-11-17 07:57:51'),('email','info@momez.com','2025-11-17 07:57:51'),('facebook','momez','2025-11-17 07:57:51'),('free_shipping_limit','100','2025-11-17 07:57:51'),('instagram','@momez','2025-11-17 07:57:51'),('phone','+90 555 123 4567','2025-11-17 07:57:51'),('site_description','En trend ayakkabı modellerini keşfedin','2025-11-17 07:57:51'),('site_name','Momez','2025-11-17 07:57:51'),('site_tagline','Adımınıza Stil Katın','2025-11-17 07:57:51'),('standard_shipping_fee','50','2025-11-17 07:57:51'),('twitter','@momez','2025-11-17 07:57:51'),('whatsapp','+90 555 123 4567','2025-11-17 07:57:51'),('youtube','momez','2025-11-17 07:57:51');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_settings` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `setting_key` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `setting_type` enum('string','number','boolean','json') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'string',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`),
  KEY `idx_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
INSERT INTO `site_settings` VALUES ('f218d429-c336-11f0-8426-56042ea1cd39','site_name','Momez','string',NULL,'2025-11-16 21:55:20','2025-11-16 21:55:20'),('f218d822-c336-11f0-8426-56042ea1cd39','site_description','En trend ayakkabı modellerini keşfedin','string',NULL,'2025-11-16 21:55:20','2025-11-16 21:55:20'),('f218e75c-c336-11f0-8426-56042ea1cd39','contact_email','info@momez.com','string',NULL,'2025-11-16 21:55:20','2025-11-16 21:55:20'),('f218e8f1-c336-11f0-8426-56042ea1cd39','contact_phone','+90 555 123 4567','string',NULL,'2025-11-16 21:55:20','2025-11-16 21:55:20'),('f218e975-c336-11f0-8426-56042ea1cd39','whatsapp_number','+90 555 123 4567','string',NULL,'2025-11-16 21:55:20','2025-11-16 21:55:20'),('f218e9f1-c336-11f0-8426-56042ea1cd39','free_shipping_threshold','500','number',NULL,'2025-11-16 21:55:20','2025-11-16 21:55:20'),('f218ea65-c336-11f0-8426-56042ea1cd39','standard_shipping_cost','50','number',NULL,'2025-11-16 21:55:20','2025-11-16 21:55:20'),('f218ead7-c336-11f0-8426-56042ea1cd39','instagram','@momez','string',NULL,'2025-11-16 21:55:20','2025-11-16 21:55:20'),('f218eb4c-c336-11f0-8426-56042ea1cd39','facebook','momez','string',NULL,'2025-11-16 21:55:20','2025-11-16 21:55:20'),('f218ebb8-c336-11f0-8426-56042ea1cd39','twitter','@momez','string',NULL,'2025-11-16 21:55:20','2025-11-16 21:55:20');
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_addresses`
--

DROP TABLE IF EXISTS `user_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_addresses` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `district` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_line` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `postal_code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_addresses`
--

LOCK TABLES `user_addresses` WRITE;
/*!40000 ALTER TABLE `user_addresses` DISABLE KEYS */;
INSERT INTO `user_addresses` VALUES ('3d6fa87f-b0d3-4924-b9d6-003c0d169cf0','e38f32cc-c34b-11f0-bf96-0e7582445334','adsadasd','asdadsasdas','adsasd','asddasdas','asdasd','asdasdd','asdasd',0,'2025-11-17 10:53:54','2025-11-17 11:21:06'),('4a9caac3-7af9-4cac-893c-5ba1d7b1054b','e38f32cc-c34b-11f0-bf96-0e7582445334','abc','as','ew','ewe','ewew','wewe','wew',1,'2025-11-17 11:21:06','2025-11-17 11:21:06'),('dffe397c-6271-4b23-91bf-18b787046a4d','180a725b-c351-11f0-a70f-0e5f7ebbeeec','abc','ömer ali','5511371796','istanbul','çekmeköy','ababababba','34569',1,'2025-11-17 04:35:06','2025-11-17 04:35:06');
/*!40000 ALTER TABLE `user_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('customer','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'customer',
  `is_active` tinyint(1) DEFAULT '1',
  `email_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('0d1eb168-c34d-11f0-bf96-0e7582445334','adalomer61@gmail.com','$2a$10$dMI5rGjtHE8jxZX5HeF5vu8faO8mulu4RgyO7KMg8aOKJIhWLKLG2','ahet','+9051','customer',1,0,'2025-11-17 00:33:35','2025-11-17 00:33:34',NULL),('180a725b-c351-11f0-a70f-0e5f7ebbeeec','adalomer31@gmail.com','$2a$10$UZ.vTVdOFDBUMd2Haa.IleFIVu8DHv6z.gml5ruq1SBHGwRdAFe7m','ahmet baba','+90512','customer',1,0,'2025-11-17 01:02:31','2025-11-17 01:02:31',NULL),('4ffab24a-c34c-11f0-bf96-0e7582445334','adalomer51@gmail.com','$2a$10$q7bftq3P70TVzeLFLnikyej3ocVoHHWAPBmqszkHvDpAWtQM5RxF.','ahmet1','+55113897','customer',1,0,'2025-11-17 00:28:18','2025-11-17 00:28:17',NULL),('e38f32cc-c34b-11f0-bf96-0e7582445334','adalomer60@gmail.com','$2a$10$kkuqJSI4EjKzcNn4KjBDvex2LLmbKc1aNrjvmil/QThFgnkaUpmjy','mehmet','+90551137','customer',1,0,'2025-11-17 00:25:16','2025-11-17 00:25:15',NULL),('f216d5ee-c336-11f0-8426-56042ea1cd39','admin@momez.com','$2a$10$oEA6FqgVA5DE51xIg/XKM.QmyOX3hz/ymhqXQRHH8M0jGeLCSmdFm','Admin User',NULL,'admin',1,0,'2025-11-16 21:55:20','2025-11-16 23:32:10',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `low_stock_products`
--

/*!50001 DROP VIEW IF EXISTS `low_stock_products`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `low_stock_products` AS select `p`.`id` AS `id`,`p`.`name` AS `name`,`ps`.`size` AS `size`,`ps`.`quantity` AS `quantity`,`p`.`is_active` AS `is_active` from (`products` `p` join `product_stock` `ps` on((`p`.`id` = `ps`.`product_id`))) where ((`ps`.`quantity` < 10) and (`p`.`is_active` = true)) order by `ps`.`quantity` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `order_statistics`
--

/*!50001 DROP VIEW IF EXISTS `order_statistics`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `order_statistics` AS select cast(`orders`.`created_at` as date) AS `order_date`,count(0) AS `total_orders`,sum(`orders`.`total`) AS `total_revenue`,avg(`orders`.`total`) AS `average_order_value` from `orders` where (`orders`.`status` not in ('cancelled','refunded')) group by cast(`orders`.`created_at` as date) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-17 11:29:52
