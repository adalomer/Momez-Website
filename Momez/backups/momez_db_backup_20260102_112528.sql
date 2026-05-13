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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_line1` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_line2` text COLLATE utf8mb4_unicode_ci,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postal_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Türkiye',
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
INSERT INTO `addresses` VALUES ('96dd83ae-e71b-11f0-9f4b-1e21c8fa904f','d1d2f1fa-e71a-11f0-9f4b-1e21c8fa904f','Ev','Test KullanÄ±cÄ±','05321234567','AtatÃ¼rk Caddesi No:123 Daire:5','Merkez Mahallesi','Ä°stanbul','KadÄ±kÃ¶y','34710','TÃ¼rkiye',1,'2026-01-01 14:10:12','2026-01-01 14:10:12'),('96ddc9ec-e71b-11f0-9f4b-1e21c8fa904f','d1d2f1fa-e71a-11f0-9f4b-1e21c8fa904f','Ä°ÅŸ','Test KullanÄ±cÄ±','05321234568','Levent Plaza Kat:8','Levent Mahallesi','Ä°stanbul','BeÅŸiktaÅŸ','34330','TÃ¼rkiye',0,'2026-01-01 14:10:12','2026-01-01 14:10:12'),('96ddcec2-e71b-11f0-9f4b-1e21c8fa904f','d1d2f926-e71a-11f0-9f4b-1e21c8fa904f','Ev','Ahmet YÄ±lmaz','05331234567','Cumhuriyet BulvarÄ± No:45/3','Alsancak Mahallesi','Ä°zmir','Konak','35220','TÃ¼rkiye',1,'2026-01-01 14:10:12','2026-01-01 14:10:12'),('96ddd183-e71b-11f0-9f4b-1e21c8fa904f','d1d2fba0-e71a-11f0-9f4b-1e21c8fa904f','Ev','AyÅŸe Demir','05341234567','KÄ±zÄ±lay Caddesi No:78/12','Ã‡ankaya Mahallesi','Ankara','Ã‡ankaya','06420','TÃ¼rkiye',1,'2026-01-01 14:10:12','2026-01-01 14:10:12'),('96dded35-e71b-11f0-9f4b-1e21c8fa904f','d1d2fba0-e71a-11f0-9f4b-1e21c8fa904f','YazlÄ±k','AyÅŸe Demir','05341234568','Sahil Sitesi B Blok No:5','AltÄ±nkum Mahallesi','AydÄ±n','Didim','09270','TÃ¼rkiye',0,'2026-01-01 14:10:12','2026-01-01 14:10:12');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaigns`
--

DROP TABLE IF EXISTS `campaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaigns` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_url` longtext COLLATE utf8mb4_unicode_ci,
  `discount_type` enum('percentage','fixed') COLLATE utf8mb4_unicode_ci DEFAULT 'percentage',
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
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
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
INSERT INTO `categories` VALUES ('a2c503cf-e719-11f0-96a9-1e21c8fa904f','Erkek Ayakkabı','erkek','Erkek ayakkabı modelleri','https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=800&fit=crop',NULL,0,1,'2026-01-01 13:56:13','2026-01-01 14:05:12'),('a2c50ba8-e719-11f0-96a9-1e21c8fa904f','Kadın Ayakkabı','kadin','Kadın ayakkabı modelleri','https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop',NULL,0,1,'2026-01-01 13:56:13','2026-01-01 14:05:12'),('a2c50e7d-e719-11f0-96a9-1e21c8fa904f','Çocuk Ayakkabı','cocuk','Çocuk ayakkabı modelleri','https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=800&fit=crop',NULL,0,1,'2026-01-01 13:56:13','2026-01-01 14:05:12'),('a2c52967-e719-11f0-96a9-1e21c8fa904f','Spor Ayakkabı','spor','Spor ayakkabı modelleri','https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop',NULL,0,1,'2026-01-01 13:56:13','2026-01-01 14:05:12'),('e3e86e89-e71a-11f0-9f4b-1e21c8fa904f','Sneaker','sneaker','Sneaker ve gÃ¼nlÃ¼k ayakkabÄ±lar','https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop',NULL,5,1,'2026-01-01 14:05:12','2026-01-01 14:05:12'),('e3e87ad1-e71a-11f0-9f4b-1e21c8fa904f','Bot & Postal','bot-postal','Bot ve postal modelleri','https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&h=800&fit=crop',NULL,6,1,'2026-01-01 14:05:12','2026-01-01 14:05:12'),('e3e87f8a-e71a-11f0-9f4b-1e21c8fa904f','Klasik AyakkabÄ±','klasik-ayakkabi','Klasik ve resmi ayakkabÄ±lar','https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&h=800&fit=crop',NULL,7,1,'2026-01-01 14:05:12','2026-01-01 14:05:12'),('e3e881d2-e71a-11f0-9f4b-1e21c8fa904f','Sandalet & Terlik','sandalet-terlik','Sandalet ve terlik modelleri','https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&h=800&fit=crop',NULL,8,1,'2026-01-01 14:05:12','2026-01-01 14:05:12');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
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
INSERT INTO `favorites` VALUES ('cf2425bf-e71b-11f0-9f4b-1e21c8fa904f','d1d2f1fa-e71a-11f0-9f4b-1e21c8fa904f','prod-002','2026-01-01 14:11:47'),('cf249822-e71b-11f0-9f4b-1e21c8fa904f','d1d2f1fa-e71a-11f0-9f4b-1e21c8fa904f','prod-007','2026-01-01 14:11:47'),('cf249e60-e71b-11f0-9f4b-1e21c8fa904f','d1d2f926-e71a-11f0-9f4b-1e21c8fa904f','prod-001','2026-01-01 14:11:47'),('cf24a1e8-e71b-11f0-9f4b-1e21c8fa904f','d1d2fba0-e71a-11f0-9f4b-1e21c8fa904f','prod-004','2026-01-01 14:11:47'),('cf24a67c-e71b-11f0-9f4b-1e21c8fa904f','d1d2fba0-e71a-11f0-9f4b-1e21c8fa904f','prod-011','2026-01-01 14:11:47');
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `order_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order` (`order_id`),
  KEY `idx_product` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES ('c6a7d605-e71b-11f0-9f4b-1e21c8fa904f','order-001','prod-001','Nike Air Max 90','https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop','42',1,2499.00,2499.00,'2025-12-17 14:11:33'),('c6a7e951-e71b-11f0-9f4b-1e21c8fa904f','order-002','prod-003','Nike Dunk Low','https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop','43',1,1999.00,1999.00,'2025-12-29 14:11:33'),('c6a7ee3c-e71b-11f0-9f4b-1e21c8fa904f','order-002','prod-008','Nike Air Force 1','https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&h=800&fit=crop','42',1,2199.00,2199.00,'2025-12-29 14:11:33'),('c6a807f3-e71b-11f0-9f4b-1e21c8fa904f','order-003','prod-005','Timberland 6-inch Boot','https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&h=800&fit=crop','44',1,3999.00,3999.00,'2025-12-31 14:11:33'),('c6a80f89-e71b-11f0-9f4b-1e21c8fa904f','order-004','prod-006','Converse Chuck Taylor','https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&h=800&fit=crop','38',1,1299.00,1299.00,'2026-01-01 14:11:33'),('c6a814c3-e71b-11f0-9f4b-1e21c8fa904f','order-005','prod-003','Nike Dunk Low','https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop','37',1,1999.00,1999.00,'2025-12-25 14:11:33');
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `order_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','confirmed','processing','shipped','delivered','cancelled','refunded') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `payment_status` enum('pending','paid','failed','refunded') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `payment_method` enum('credit_card','bank_transfer','cash_on_delivery') COLLATE utf8mb4_unicode_ci DEFAULT 'cash_on_delivery',
  `subtotal` decimal(10,2) NOT NULL,
  `shipping_cost` decimal(10,2) DEFAULT '0.00',
  `tax` decimal(10,2) DEFAULT '0.00',
  `discount` decimal(10,2) DEFAULT '0.00',
  `total` decimal(10,2) NOT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT 'TRY',
  `shipping_address_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billing_address_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tracking_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `cancelled_reason` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `shipping_address_id` (`shipping_address_id`),
  KEY `billing_address_id` (`billing_address_id`),
  KEY `idx_order_number` (`order_number`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created` (`created_at`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`shipping_address_id`) REFERENCES `addresses` (`id`) ON DELETE SET NULL,
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`billing_address_id`) REFERENCES `addresses` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('order-001','MZ2025000001','d1d2f1fa-e71a-11f0-9f4b-1e21c8fa904f','delivered','paid','credit_card',2499.00,29.99,449.82,0.00,2978.81,'TRY','96dd83ae-e71b-11f0-9f4b-1e21c8fa904f','96dd83ae-e71b-11f0-9f4b-1e21c8fa904f','TR123456789',NULL,NULL,NULL,'2025-12-17 14:11:17','2025-12-22 14:11:17'),('order-002','MZ2025000002','d1d2f1fa-e71a-11f0-9f4b-1e21c8fa904f','shipped','paid','credit_card',4498.00,0.00,809.64,200.00,5107.64,'TRY','96ddc9ec-e71b-11f0-9f4b-1e21c8fa904f','96ddc9ec-e71b-11f0-9f4b-1e21c8fa904f','TR987654321','HÄ±zlÄ± kargo lÃ¼tfen',NULL,NULL,'2025-12-29 14:11:17','2025-12-31 14:11:17'),('order-003','MZ2025000003','d1d2f926-e71a-11f0-9f4b-1e21c8fa904f','processing','paid','bank_transfer',3999.00,0.00,719.82,0.00,4718.82,'TRY','96ddcec2-e71b-11f0-9f4b-1e21c8fa904f','96ddcec2-e71b-11f0-9f4b-1e21c8fa904f',NULL,NULL,NULL,NULL,'2025-12-31 14:11:17','2026-01-01 14:11:17'),('order-004','MZ2025000004','d1d2fba0-e71a-11f0-9f4b-1e21c8fa904f','confirmed','paid','cash_on_delivery',1299.00,29.99,233.82,0.00,1562.81,'TRY','96ddd183-e71b-11f0-9f4b-1e21c8fa904f','96ddd183-e71b-11f0-9f4b-1e21c8fa904f',NULL,NULL,NULL,NULL,'2026-01-01 14:11:17','2026-01-01 14:11:17'),('order-005','MZ2025000005','d1d2fba0-e71a-11f0-9f4b-1e21c8fa904f','cancelled','refunded','credit_card',1999.00,29.99,359.82,0.00,2388.81,'TRY','96dded35-e71b-11f0-9f4b-1e21c8fa904f','96dded35-e71b-11f0-9f4b-1e21c8fa904f',NULL,'Ä°ptal edildi',NULL,NULL,'2025-12-25 14:11:17','2025-12-27 14:11:17');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reset_code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_code` (`reset_code`),
  KEY `idx_expires` (`expires_at`),
  CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `product_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
INSERT INTO `product_images` VALUES ('204c1e83-d13f-4063-b4b0-eb06de9f2108','prod-001','https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&h=800&fit=crop',NULL,1,0,'2026-01-01 17:16:37'),('2bf7a56d-0837-43b3-a2d5-33606b3f1953','prod-001','/uploads/1767287795445_WhatsApp_Image_2025_12_03_at_14.51.46__1_.jpeg',NULL,3,0,'2026-01-01 17:16:37'),('3ecf8700-86d1-493e-b8f7-f9bdb2e577d3','prod-001','https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop',NULL,0,1,'2026-01-01 17:16:37'),('7f2f84d8-e71b-11f0-9f4b-1e21c8fa904f','prod-002','https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop','Adidas Ultraboost - Siyah',1,1,'2026-01-01 14:09:33'),('7f2f8848-e71b-11f0-9f4b-1e21c8fa904f','prod-002','https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800&h=800&fit=crop','Adidas Ultraboost - Beyaz',2,0,'2026-01-01 14:09:33'),('7f2f8c8c-e71b-11f0-9f4b-1e21c8fa904f','prod-003','https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop','Nike Dunk Low - Panda',1,1,'2026-01-01 14:09:33'),('7f2f8feb-e71b-11f0-9f4b-1e21c8fa904f','prod-003','https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&h=800&fit=crop','Nike Dunk Low - Mavi',2,0,'2026-01-01 14:09:33'),('7f2f9334-e71b-11f0-9f4b-1e21c8fa904f','prod-004','https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&h=800&fit=crop','New Balance 574 - Gri',1,1,'2026-01-01 14:09:33'),('7f2f9661-e71b-11f0-9f4b-1e21c8fa904f','prod-004','https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&h=800&fit=crop','New Balance 574 - Lacivert',2,0,'2026-01-01 14:09:33'),('7f2f99af-e71b-11f0-9f4b-1e21c8fa904f','prod-005','https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&h=800&fit=crop','Timberland Boot - SarÄ±',1,1,'2026-01-01 14:09:33'),('7f2f9cd7-e71b-11f0-9f4b-1e21c8fa904f','prod-005','https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=800&h=800&fit=crop','Timberland Boot - Siyah',2,0,'2026-01-01 14:09:33'),('7f2f9fd3-e71b-11f0-9f4b-1e21c8fa904f','prod-006','https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&h=800&fit=crop','Converse Chuck Taylor - Siyah',1,1,'2026-01-01 14:09:33'),('7f2fa567-e71b-11f0-9f4b-1e21c8fa904f','prod-006','https://images.unsplash.com/photo-1494496195158-c3becb4f2475?w=800&h=800&fit=crop','Converse Chuck Taylor - Beyaz',2,0,'2026-01-01 14:09:33'),('7f2fa928-e71b-11f0-9f4b-1e21c8fa904f','prod-006','https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=800&h=800&fit=crop','Converse Chuck Taylor - KÄ±rmÄ±zÄ±',3,0,'2026-01-01 14:09:33'),('7f2fac83-e71b-11f0-9f4b-1e21c8fa904f','prod-007','https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=800&h=800&fit=crop','Dr. Martens 1460 - Siyah',1,1,'2026-01-01 14:09:33'),('7f2fafea-e71b-11f0-9f4b-1e21c8fa904f','prod-007','https://images.unsplash.com/photo-1601924921557-45e6ddf54b97?w=800&h=800&fit=crop','Dr. Martens 1460 - Cherry',2,0,'2026-01-01 14:09:33'),('7f2fbccb-e71b-11f0-9f4b-1e21c8fa904f','prod-008','https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&h=800&fit=crop','Nike Air Force 1 - Beyaz',1,1,'2026-01-01 14:09:33'),('7f2fc0b5-e71b-11f0-9f4b-1e21c8fa904f','prod-008','https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop','Nike Air Force 1 - Siyah',2,0,'2026-01-01 14:09:33'),('7f2fc3f4-e71b-11f0-9f4b-1e21c8fa904f','prod-009','https://images.unsplash.com/photo-1608379743498-a39f3c6b0477?w=800&h=800&fit=crop','Puma RS-X - Multi',1,1,'2026-01-01 14:09:33'),('7f2fc697-e71b-11f0-9f4b-1e21c8fa904f','prod-010','https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&h=800&fit=crop','Vans Old Skool - Siyah/Beyaz',1,1,'2026-01-01 14:09:33'),('7f2fcbfb-e71b-11f0-9f4b-1e21c8fa904f','prod-011','https://images.unsplash.com/photo-1603808033176-9d134e6f2c74?w=800&h=800&fit=crop','Adidas Stan Smith - Beyaz/YeÅŸil',1,1,'2026-01-01 14:09:33'),('7f2fcf53-e71b-11f0-9f4b-1e21c8fa904f','prod-011','https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&h=800&fit=crop','Adidas Stan Smith - Beyaz/Lacivert',2,0,'2026-01-01 14:09:33'),('7f2fd2a4-e71b-11f0-9f4b-1e21c8fa904f','prod-012','https://images.unsplash.com/photo-1596522354195-e84ae3c98731?w=800&h=800&fit=crop','Nike Revolution Kids - Mavi',1,1,'2026-01-01 14:09:33'),('7f2fd624-e71b-11f0-9f4b-1e21c8fa904f','prod-012','https://images.unsplash.com/photo-1565118531796-763e5082d113?w=800&h=800&fit=crop','Nike Revolution Kids - Pembe',2,0,'2026-01-01 14:09:33'),('b8af0d66-7c90-4b62-a4e3-2beadbbbcc66','prod-001','https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&h=800&fit=crop',NULL,2,0,'2026-01-01 17:16:37');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_stock`
--

DROP TABLE IF EXISTS `product_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_stock` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `product_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
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
INSERT INTO `product_stock` VALUES ('0c8239b3-8888-47d3-9ee7-0338cf268219','prod-001','38',15,0,'2026-01-01 17:16:37','2026-01-01 17:16:37'),('382c3ef3-14dc-4a79-a2a2-56e0682af516','prod-001','39',6,0,'2026-01-01 17:16:37','2026-01-01 17:16:37'),('5d03e168-bcee-4b87-a081-8a3b897d4f48','prod-001','44',17,0,'2026-01-01 17:16:37','2026-01-01 17:16:37'),('855054c6-e71b-11f0-9f4b-1e21c8fa904f','prod-002','46',7,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85505680-e71b-11f0-9f4b-1e21c8fa904f','prod-002','45',13,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('855057b8-e71b-11f0-9f4b-1e21c8fa904f','prod-002','44',8,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('855058e1-e71b-11f0-9f4b-1e21c8fa904f','prod-002','43',12,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85505a1b-e71b-11f0-9f4b-1e21c8fa904f','prod-002','42',16,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85505b45-e71b-11f0-9f4b-1e21c8fa904f','prod-002','41',9,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85505c92-e71b-11f0-9f4b-1e21c8fa904f','prod-002','40',8,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85505ece-e71b-11f0-9f4b-1e21c8fa904f','prod-002','39',10,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85506093-e71b-11f0-9f4b-1e21c8fa904f','prod-002','38',5,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85507124-e71b-11f0-9f4b-1e21c8fa904f','prod-002','37',7,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85507495-e71b-11f0-9f4b-1e21c8fa904f','prod-002','36',17,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550777c-e71b-11f0-9f4b-1e21c8fa904f','prod-003','46',12,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85507f23-e71b-11f0-9f4b-1e21c8fa904f','prod-003','45',6,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('855086d9-e71b-11f0-9f4b-1e21c8fa904f','prod-003','44',18,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('855089b3-e71b-11f0-9f4b-1e21c8fa904f','prod-003','43',9,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85508bf4-e71b-11f0-9f4b-1e21c8fa904f','prod-003','42',15,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85508f33-e71b-11f0-9f4b-1e21c8fa904f','prod-003','41',13,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('855091dc-e71b-11f0-9f4b-1e21c8fa904f','prod-003','40',15,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('855093f9-e71b-11f0-9f4b-1e21c8fa904f','prod-003','39',15,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85509648-e71b-11f0-9f4b-1e21c8fa904f','prod-003','38',13,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('855099b3-e71b-11f0-9f4b-1e21c8fa904f','prod-003','37',17,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550a2c7-e71b-11f0-9f4b-1e21c8fa904f','prod-003','36',9,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550a6ea-e71b-11f0-9f4b-1e21c8fa904f','prod-004','46',7,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550a943-e71b-11f0-9f4b-1e21c8fa904f','prod-004','45',16,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550ace9-e71b-11f0-9f4b-1e21c8fa904f','prod-004','44',11,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550afe8-e71b-11f0-9f4b-1e21c8fa904f','prod-004','43',18,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550b235-e71b-11f0-9f4b-1e21c8fa904f','prod-004','42',8,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550b45b-e71b-11f0-9f4b-1e21c8fa904f','prod-004','41',13,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550b6a1-e71b-11f0-9f4b-1e21c8fa904f','prod-004','40',19,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550b8c6-e71b-11f0-9f4b-1e21c8fa904f','prod-004','39',8,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550bc11-e71b-11f0-9f4b-1e21c8fa904f','prod-004','38',6,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550be42-e71b-11f0-9f4b-1e21c8fa904f','prod-004','37',17,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550c06d-e71b-11f0-9f4b-1e21c8fa904f','prod-004','36',19,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550c2fd-e71b-11f0-9f4b-1e21c8fa904f','prod-005','46',9,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550c52f-e71b-11f0-9f4b-1e21c8fa904f','prod-005','45',12,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550c754-e71b-11f0-9f4b-1e21c8fa904f','prod-005','44',15,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550c976-e71b-11f0-9f4b-1e21c8fa904f','prod-005','43',5,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550cd06-e71b-11f0-9f4b-1e21c8fa904f','prod-005','42',7,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550cf4b-e71b-11f0-9f4b-1e21c8fa904f','prod-005','41',14,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550d13b-e71b-11f0-9f4b-1e21c8fa904f','prod-005','40',13,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550d572-e71b-11f0-9f4b-1e21c8fa904f','prod-005','39',5,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550d7ad-e71b-11f0-9f4b-1e21c8fa904f','prod-005','38',12,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550d99e-e71b-11f0-9f4b-1e21c8fa904f','prod-005','37',9,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550dcd9-e71b-11f0-9f4b-1e21c8fa904f','prod-005','36',5,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550e3c7-e71b-11f0-9f4b-1e21c8fa904f','prod-006','46',11,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550e95e-e71b-11f0-9f4b-1e21c8fa904f','prod-006','45',17,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550ebef-e71b-11f0-9f4b-1e21c8fa904f','prod-006','44',19,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550ef6f-e71b-11f0-9f4b-1e21c8fa904f','prod-006','43',8,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550f1df-e71b-11f0-9f4b-1e21c8fa904f','prod-006','42',7,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550f6ca-e71b-11f0-9f4b-1e21c8fa904f','prod-006','41',9,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550f990-e71b-11f0-9f4b-1e21c8fa904f','prod-006','40',6,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550fbc5-e71b-11f0-9f4b-1e21c8fa904f','prod-006','39',11,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8550fe1a-e71b-11f0-9f4b-1e21c8fa904f','prod-006','38',19,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85510479-e71b-11f0-9f4b-1e21c8fa904f','prod-006','37',14,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85510d9c-e71b-11f0-9f4b-1e21c8fa904f','prod-006','36',7,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85511247-e71b-11f0-9f4b-1e21c8fa904f','prod-007','46',19,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('855115f4-e71b-11f0-9f4b-1e21c8fa904f','prod-007','45',8,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85511866-e71b-11f0-9f4b-1e21c8fa904f','prod-007','44',8,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85511d3a-e71b-11f0-9f4b-1e21c8fa904f','prod-007','43',11,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85511fd1-e71b-11f0-9f4b-1e21c8fa904f','prod-007','42',12,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('855121fc-e71b-11f0-9f4b-1e21c8fa904f','prod-007','41',10,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551241a-e71b-11f0-9f4b-1e21c8fa904f','prod-007','40',7,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85512644-e71b-11f0-9f4b-1e21c8fa904f','prod-007','39',15,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551286f-e71b-11f0-9f4b-1e21c8fa904f','prod-007','38',7,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85512aa8-e71b-11f0-9f4b-1e21c8fa904f','prod-007','37',14,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85512cca-e71b-11f0-9f4b-1e21c8fa904f','prod-007','36',16,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85512f40-e71b-11f0-9f4b-1e21c8fa904f','prod-008','46',17,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85513194-e71b-11f0-9f4b-1e21c8fa904f','prod-008','45',17,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('855136b2-e71b-11f0-9f4b-1e21c8fa904f','prod-008','44',15,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85513fe4-e71b-11f0-9f4b-1e21c8fa904f','prod-008','43',18,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551436e-e71b-11f0-9f4b-1e21c8fa904f','prod-008','42',12,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('855146be-e71b-11f0-9f4b-1e21c8fa904f','prod-008','41',16,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85514936-e71b-11f0-9f4b-1e21c8fa904f','prod-008','40',8,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85514f8b-e71b-11f0-9f4b-1e21c8fa904f','prod-008','39',5,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551522e-e71b-11f0-9f4b-1e21c8fa904f','prod-008','38',13,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85515461-e71b-11f0-9f4b-1e21c8fa904f','prod-008','37',12,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('855156a2-e71b-11f0-9f4b-1e21c8fa904f','prod-008','36',18,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551591c-e71b-11f0-9f4b-1e21c8fa904f','prod-009','46',19,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85515b5d-e71b-11f0-9f4b-1e21c8fa904f','prod-009','45',5,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85515d99-e71b-11f0-9f4b-1e21c8fa904f','prod-009','44',9,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85515ff1-e71b-11f0-9f4b-1e21c8fa904f','prod-009','43',11,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85516238-e71b-11f0-9f4b-1e21c8fa904f','prod-009','42',9,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('855167f9-e71b-11f0-9f4b-1e21c8fa904f','prod-009','41',8,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85516cd6-e71b-11f0-9f4b-1e21c8fa904f','prod-009','40',9,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85517087-e71b-11f0-9f4b-1e21c8fa904f','prod-009','39',17,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551736f-e71b-11f0-9f4b-1e21c8fa904f','prod-009','38',8,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('855175f7-e71b-11f0-9f4b-1e21c8fa904f','prod-009','37',16,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('855177fd-e71b-11f0-9f4b-1e21c8fa904f','prod-009','36',19,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85517b9a-e71b-11f0-9f4b-1e21c8fa904f','prod-010','46',15,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85517eda-e71b-11f0-9f4b-1e21c8fa904f','prod-010','45',13,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('855183a7-e71b-11f0-9f4b-1e21c8fa904f','prod-010','44',13,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85518605-e71b-11f0-9f4b-1e21c8fa904f','prod-010','43',10,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551884a-e71b-11f0-9f4b-1e21c8fa904f','prod-010','42',5,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85518a4f-e71b-11f0-9f4b-1e21c8fa904f','prod-010','41',7,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85518c3a-e71b-11f0-9f4b-1e21c8fa904f','prod-010','40',16,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85518e2d-e71b-11f0-9f4b-1e21c8fa904f','prod-010','39',7,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85519410-e71b-11f0-9f4b-1e21c8fa904f','prod-010','38',15,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85519969-e71b-11f0-9f4b-1e21c8fa904f','prod-010','37',18,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85519b94-e71b-11f0-9f4b-1e21c8fa904f','prod-010','36',12,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85519e11-e71b-11f0-9f4b-1e21c8fa904f','prod-011','46',16,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('85519fb0-e71b-11f0-9f4b-1e21c8fa904f','prod-011','45',9,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551a142-e71b-11f0-9f4b-1e21c8fa904f','prod-011','44',6,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551a281-e71b-11f0-9f4b-1e21c8fa904f','prod-011','43',13,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551a3b3-e71b-11f0-9f4b-1e21c8fa904f','prod-011','42',15,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551a4eb-e71b-11f0-9f4b-1e21c8fa904f','prod-011','41',15,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551a619-e71b-11f0-9f4b-1e21c8fa904f','prod-011','40',12,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551a85a-e71b-11f0-9f4b-1e21c8fa904f','prod-011','39',10,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551a9a4-e71b-11f0-9f4b-1e21c8fa904f','prod-011','38',8,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551aad8-e71b-11f0-9f4b-1e21c8fa904f','prod-011','37',5,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551ac0d-e71b-11f0-9f4b-1e21c8fa904f','prod-011','36',14,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551ad5e-e71b-11f0-9f4b-1e21c8fa904f','prod-012','46',5,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551aea3-e71b-11f0-9f4b-1e21c8fa904f','prod-012','45',8,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551afdc-e71b-11f0-9f4b-1e21c8fa904f','prod-012','44',7,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551b1f7-e71b-11f0-9f4b-1e21c8fa904f','prod-012','43',7,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551b38e-e71b-11f0-9f4b-1e21c8fa904f','prod-012','42',7,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551b5b7-e71b-11f0-9f4b-1e21c8fa904f','prod-012','41',9,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551b7f0-e71b-11f0-9f4b-1e21c8fa904f','prod-012','40',7,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551b9b4-e71b-11f0-9f4b-1e21c8fa904f','prod-012','39',19,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551baf8-e71b-11f0-9f4b-1e21c8fa904f','prod-012','38',9,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551bc25-e71b-11f0-9f4b-1e21c8fa904f','prod-012','37',12,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8551bd4e-e71b-11f0-9f4b-1e21c8fa904f','prod-012','36',12,0,'2026-01-01 14:09:43','2026-01-01 14:09:43'),('8cc4718b-e0e4-4f63-83de-b2508395b9f7','prod-001','45',5,0,'2026-01-01 17:16:37','2026-01-01 17:16:37'),('bb0a7fce-8788-4be8-b60c-6bc4ac3630d4','prod-001','36',11,0,'2026-01-01 17:16:37','2026-01-01 17:16:37'),('befe119b-1f4b-4f86-bf8b-6667a4a7cd27','prod-001','37',9,0,'2026-01-01 17:16:37','2026-01-01 17:16:37'),('c1b3c7e0-ad9a-4f13-a01a-ac276f75c4a6','prod-001','40',14,0,'2026-01-01 17:16:37','2026-01-01 17:16:37'),('ca9c1b55-305d-4d98-9527-4f0ca83515a4','prod-001','41',14,0,'2026-01-01 17:16:37','2026-01-01 17:16:37'),('cd8d2e8d-bf27-4c00-ac53-581010e31aad','prod-001','42',12,0,'2026-01-01 17:16:37','2026-01-01 17:16:37'),('ddf9a84e-0dd8-4fb2-ad89-2cb8d1b5ba1b','prod-001','46',11,0,'2026-01-01 17:16:37','2026-01-01 17:16:37'),('e706c8f9-301b-4cc1-800b-307782004120','prod-001','43',19,0,'2026-01-01 17:16:37','2026-01-01 17:16:37');
/*!40000 ALTER TABLE `product_stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `compare_at_price` decimal(10,2) DEFAULT NULL,
  `cost_price` decimal(10,2) DEFAULT NULL,
  `sku` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
INSERT INTO `products` VALUES ('prod-001','Nike Air Max 90','nike-air-max-90','Nike Air Max 90 spor ayakkabÄ±. Rahat ve ÅŸÄ±k tasarÄ±m.',2499.00,NULL,NULL,NULL,'a2c52967-e719-11f0-96a9-1e21c8fa904f','Nike',1,1,0,NULL,NULL,'2026-01-01 14:08:26','2026-01-01 17:16:37'),('prod-002','Adidas Ultraboost','adidas-ultraboost','Adidas Ultraboost koÅŸu ayakkabÄ±sÄ±. Maksimum konfor.',3299.00,3799.00,NULL,NULL,'a2c52967-e719-11f0-96a9-1e21c8fa904f','Adidas',1,1,1,NULL,NULL,'2026-01-01 14:08:26','2026-01-01 14:08:26'),('prod-003','Nike Dunk Low','nike-dunk-low','Nike Dunk Low retro sneaker. Klasik tasarÄ±m.',1999.00,NULL,NULL,NULL,'e3e86e89-e71a-11f0-9f4b-1e21c8fa904f','Nike',1,1,0,NULL,NULL,'2026-01-01 14:08:26','2026-01-01 14:08:26'),('prod-004','New Balance 574','new-balance-574','New Balance 574 gÃ¼nlÃ¼k sneaker. Efsanevi model.',1799.00,2199.00,NULL,NULL,'e3e86e89-e71a-11f0-9f4b-1e21c8fa904f','New Balance',1,1,0,NULL,NULL,'2026-01-01 14:08:26','2026-01-01 14:08:26'),('prod-005','Timberland 6-inch Boot','timberland-6-inch-boot','Timberland klasik 6 inÃ§ bot. Su geÃ§irmez.',3999.00,4499.00,NULL,NULL,'e3e87ad1-e71a-11f0-9f4b-1e21c8fa904f','Timberland',1,1,0,NULL,NULL,'2026-01-01 14:08:26','2026-01-01 14:08:26'),('prod-006','Converse Chuck Taylor','converse-chuck-taylor','Converse Chuck Taylor All Star. ZamansÄ±z stil.',1299.00,NULL,NULL,NULL,'e3e86e89-e71a-11f0-9f4b-1e21c8fa904f','Converse',1,0,0,NULL,NULL,'2026-01-01 14:08:26','2026-01-01 14:08:26'),('prod-007','Dr. Martens 1460','dr-martens-1460','Dr. Martens 1460 klasik bot. DayanÄ±klÄ± tasarÄ±m.',4299.00,NULL,NULL,NULL,'e3e87ad1-e71a-11f0-9f4b-1e21c8fa904f','Dr. Martens',1,1,1,NULL,NULL,'2026-01-01 14:08:26','2026-01-01 14:08:26'),('prod-008','Nike Air Force 1','nike-air-force-1','Nike Air Force 1 beyaz sneaker. Ä°konik model.',2199.00,2499.00,NULL,NULL,'a2c503cf-e719-11f0-96a9-1e21c8fa904f','Nike',1,1,0,NULL,NULL,'2026-01-01 14:08:26','2026-01-01 14:08:26'),('prod-009','Puma RS-X','puma-rs-x','Puma RS-X chunky sneaker. Retro-fÃ¼tÃ¼rist tasarÄ±m.',1899.00,2299.00,NULL,NULL,'e3e86e89-e71a-11f0-9f4b-1e21c8fa904f','Puma',1,0,0,NULL,NULL,'2026-01-01 14:08:26','2026-01-01 14:08:26'),('prod-010','Vans Old Skool','vans-old-skool','Vans Old Skool klasik skate ayakkabÄ±.',1199.00,NULL,NULL,NULL,'e3e86e89-e71a-11f0-9f4b-1e21c8fa904f','Vans',1,0,0,NULL,NULL,'2026-01-01 14:08:26','2026-01-01 14:08:26'),('prod-011','Adidas Stan Smith','adidas-stan-smith','Adidas Stan Smith tenis ayakkabÄ±sÄ±. Minimalist stil.',1699.00,1999.00,NULL,NULL,'a2c50ba8-e719-11f0-96a9-1e21c8fa904f','Adidas',1,1,0,NULL,NULL,'2026-01-01 14:08:26','2026-01-01 14:08:26'),('prod-012','Nike Revolution Kids','nike-revolution-kids','Nike Revolution Ã§ocuk spor ayakkabÄ±sÄ±. Hafif ve esnek.',899.00,1099.00,NULL,NULL,'a2c50e7d-e719-11f0-96a9-1e21c8fa904f','Nike',1,0,1,NULL,NULL,'2026-01-01 14:08:26','2026-01-01 14:08:26');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_settings` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `setting_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text COLLATE utf8mb4_unicode_ci,
  `setting_type` enum('string','number','boolean','json') COLLATE utf8mb4_unicode_ci DEFAULT 'string',
  `description` text COLLATE utf8mb4_unicode_ci,
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
INSERT INTO `site_settings` VALUES ('cf237075-e71b-11f0-9f4b-1e21c8fa904f','site_name','Momez','string','Site adÄ±','2026-01-01 14:11:47','2026-01-01 14:11:47'),('cf237f3f-e71b-11f0-9f4b-1e21c8fa904f','site_description','En ÅžÄ±k AyakkabÄ±lar','string','Site aÃ§Ä±klamasÄ±','2026-01-01 14:11:47','2026-01-01 14:11:47'),('cf238878-e71b-11f0-9f4b-1e21c8fa904f','contact_email','info@momez.co','string','Ä°letiÅŸim e-posta','2026-01-01 14:11:47','2026-01-01 14:11:47'),('cf238bef-e71b-11f0-9f4b-1e21c8fa904f','contact_phone','+90 555 123 4567','string','Ä°letiÅŸim telefon','2026-01-01 14:11:47','2026-01-01 14:11:47'),('cf238f86-e71b-11f0-9f4b-1e21c8fa904f','free_shipping_threshold','500','number','Ãœcretsiz kargo limiti','2026-01-01 14:11:47','2026-01-01 14:11:47'),('cf239733-e71b-11f0-9f4b-1e21c8fa904f','shipping_cost','29.99','number','Kargo Ã¼creti','2026-01-01 14:11:47','2026-01-01 14:11:47'),('cf23993f-e71b-11f0-9f4b-1e21c8fa904f','currency','TRY','string','Para birimi','2026-01-01 14:11:47','2026-01-01 14:11:47'),('cf239b22-e71b-11f0-9f4b-1e21c8fa904f','tax_rate','18','number','KDV oranÄ±','2026-01-01 14:11:47','2026-01-01 14:11:47');
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('customer','admin') COLLATE utf8mb4_unicode_ci DEFAULT 'customer',
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
INSERT INTO `users` VALUES ('a2c4546c-e719-11f0-96a9-1e21c8fa904f','admin@momez.com','$2a$10$um0isb03cAOoBR96irMBke8YzdYWNKRyZj5/2Jgct6pvrGmakquCi','Admin KullanÄ±cÄ±',NULL,'admin',1,0,'2026-01-01 13:56:13','2026-01-01 14:04:42',NULL),('d1d2f1fa-e71a-11f0-9f4b-1e21c8fa904f','test@momez.com','$2a$10$um0isb03cAOoBR96irMBke8YzdYWNKRyZj5/2Jgct6pvrGmakquCi','Test KullanÄ±cÄ±','+90 555 111 11111','customer',1,1,'2026-01-01 14:04:42','2026-01-01 14:23:41',NULL),('d1d2f926-e71a-11f0-9f4b-1e21c8fa904f','ahmet@example.com','$2a$10$um0isb03cAOoBR96irMBke8YzdYWNKRyZj5/2Jgct6pvrGmakquCi','Ahmet YÄ±lmaz','+90 555 222 2222','customer',1,1,'2026-01-01 14:04:42','2026-01-01 14:04:42',NULL),('d1d2fba0-e71a-11f0-9f4b-1e21c8fa904f','ayse@example.com','$2a$10$um0isb03cAOoBR96irMBke8YzdYWNKRyZj5/2Jgct6pvrGmakquCi','AyÅŸe Demir','+90 555 333 3333','customer',1,1,'2026-01-01 14:04:42','2026-01-01 14:04:42',NULL);
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

-- Dump completed on 2026-01-02 11:25:29
