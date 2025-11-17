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
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
INSERT INTO `campaigns` VALUES ('e4fc1b3a-3a32-4c64-b578-dcc97a9c9ad3','aaaa','aaaa','eeeee',NULL,'percentage',30.00,'2025-10-20 00:00:00','2025-12-25 00:00:00',1,'2025-11-17 01:49:41','2025-11-17 01:49:41');
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
INSERT INTO `categories` VALUES ('3ded2992-c34e-11f0-a70f-0e5f7ebbeeec','Spor ayakkabı','spor-ayakkabi',NULL,NULL,NULL,0,1,'2025-11-17 00:42:06','2025-11-17 00:42:06'),('f217b45d-c336-11f0-8426-56042ea1cd39','Erkek Ayakkabı','erkek','Erkek ayakkabı modelleri',NULL,NULL,0,1,'2025-11-16 21:55:20','2025-11-16 21:55:20'),('f217b8b7-c336-11f0-8426-56042ea1cd39','Kadın Ayakkabı','kadin','Kadın ayakkabı modelleri',NULL,NULL,0,1,'2025-11-16 21:55:20','2025-11-16 21:55:20'),('f217baf9-c336-11f0-8426-56042ea1cd39','Çocuk Ayakkabı','cocuk-ayakkabi',NULL,'/uploads/1763347762649_121644326.jpeg',NULL,0,1,'2025-11-16 21:55:20','2025-11-17 02:49:24'),('f217bbd3-c336-11f0-8426-56042ea1cd39','Spor Ayakkabı','spor','Spor ayakkabı modelleri',NULL,NULL,0,1,'2025-11-16 21:55:20','2025-11-16 21:55:20');
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
INSERT INTO `favorites` VALUES ('3470bc12-c38b-11f0-a2a0-c60372611b8b','180a725b-c351-11f0-a70f-0e5f7ebbeeec','2d8c6024-c365-11f0-a70f-0e5f7ebbeeec','2025-11-17 07:58:29');
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
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
INSERT INTO `order_items` VALUES ('4d9f228c-c848-49a6-b590-83557aed63db','cd10300c-84c0-4550-b778-398cb03bbaa7','a7d4830b-c363-11f0-a70f-0e5f7ebbeeec','aaa','39',1,100.00,'2025-11-17 04:35:27'),('781b4ee7-2ca8-4da9-80a6-f1bfe0636f51','3ed4c318-45de-4ce6-83e6-bd2bdeec6d07','a7d4830b-c363-11f0-a70f-0e5f7ebbeeec','aaa','40',1,100.00,'2025-11-17 04:44:36'),('a2f5ab7d-afce-4b42-9c6b-59afc5067d85','e08b3c53-2fe0-430b-b34a-2ca6d3344f40','a7d4830b-c363-11f0-a70f-0e5f7ebbeeec','aaa','38',1,100.00,'2025-11-17 07:58:53'),('e81bc509-5712-4510-9ade-afd53c182696','1100425e-f4d1-4615-beec-e081aa575b7e','a7d4830b-c363-11f0-a70f-0e5f7ebbeeec','aaa','39',1,100.00,'2025-11-17 04:39:27');
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_method` enum('card','cash_on_delivery') COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `shipping_cost` decimal(10,2) DEFAULT '0.00',
  `total` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','preparing','shipped','delivered','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `notes` text COLLATE utf8mb4_unicode_ci,
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
INSERT INTO `orders` VALUES ('1100425e-f4d1-4615-beec-e081aa575b7e','180a725b-c351-11f0-a70f-0e5f7ebbeeec','OR-20251117-1863','dffe397c-6271-4b23-91bf-18b787046a4d','cash_on_delivery',100.00,50.00,150.00,'delivered',NULL,'2025-11-17 04:39:27','2025-11-17 07:56:48'),('3ed4c318-45de-4ce6-83e6-bd2bdeec6d07','180a725b-c351-11f0-a70f-0e5f7ebbeeec','OR-20251117-6634','dffe397c-6271-4b23-91bf-18b787046a4d','cash_on_delivery',100.00,50.00,150.00,'shipped',NULL,'2025-11-17 04:44:36','2025-11-17 07:56:28'),('cd10300c-84c0-4550-b778-398cb03bbaa7','180a725b-c351-11f0-a70f-0e5f7ebbeeec','OR-20251117-4518','dffe397c-6271-4b23-91bf-18b787046a4d','cash_on_delivery',100.00,50.00,150.00,'pending',NULL,'2025-11-17 04:35:27','2025-11-17 04:35:27'),('e08b3c53-2fe0-430b-b34a-2ca6d3344f40','180a725b-c351-11f0-a70f-0e5f7ebbeeec','OR-20251117-5150','dffe397c-6271-4b23-91bf-18b787046a4d','cash_on_delivery',100.00,50.00,150.00,'shipped',NULL,'2025-11-17 07:58:53','2025-11-17 08:02:41');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
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
INSERT INTO `product_images` VALUES ('55a74941-c366-11f0-bfcd-aea560a7fec0','a7d4830b-c363-11f0-a70f-0e5f7ebbeeec','/uploads/1763349317497_6.png',NULL,0,1,'2025-11-17 03:34:33'),('daf303da-c36c-11f0-a407-3a6d8ca4197d','f34b68fd-c362-11f0-a70f-0e5f7ebbeeec','/uploads/1763349016199_170a894f_ebdd_4810_85dc_fd07eb211132.png',NULL,0,1,'2025-11-17 04:21:14'),('e86f72dd-c38d-11f0-b555-6680711a0561','2d8c6024-c365-11f0-a70f-0e5f7ebbeeec','/uploads/1763367467837_resim_2024_05_11_182142785.png',NULL,0,1,'2025-11-17 08:17:50'),('fa07454e-c361-11f0-a70f-0e5f7ebbeeec','fa054ccb-c361-11f0-a70f-0e5f7ebbeeec','/uploads/1763348571263_ChatGPT_Image_7_Haz_2025_14_34_00.png',NULL,0,1,'2025-11-17 03:03:22');
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
INSERT INTO `product_stock` VALUES ('55a8f2b2-c366-11f0-bfcd-aea560a7fec0','a7d4830b-c363-11f0-a70f-0e5f7ebbeeec','38',9,0,'2025-11-17 03:34:33','2025-11-17 07:58:53'),('55a9c484-c366-11f0-bfcd-aea560a7fec0','a7d4830b-c363-11f0-a70f-0e5f7ebbeeec','39',3,0,'2025-11-17 03:34:33','2025-11-17 04:39:27'),('55aa7e4a-c366-11f0-bfcd-aea560a7fec0','a7d4830b-c363-11f0-a70f-0e5f7ebbeeec','40',7,0,'2025-11-17 03:34:33','2025-11-17 04:44:36'),('55abc04a-c366-11f0-bfcd-aea560a7fec0','a7d4830b-c363-11f0-a70f-0e5f7ebbeeec','41',0,0,'2025-11-17 03:34:33','2025-11-17 03:34:33'),('daf4090c-c36c-11f0-a407-3a6d8ca4197d','f34b68fd-c362-11f0-a70f-0e5f7ebbeeec','36',4,0,'2025-11-17 04:21:14','2025-11-17 04:21:14'),('daf4c3f7-c36c-11f0-a407-3a6d8ca4197d','f34b68fd-c362-11f0-a70f-0e5f7ebbeeec','37',0,0,'2025-11-17 04:21:14','2025-11-17 04:21:14'),('daf63b29-c36c-11f0-a407-3a6d8ca4197d','f34b68fd-c362-11f0-a70f-0e5f7ebbeeec','38',0,0,'2025-11-17 04:21:14','2025-11-17 04:21:14'),('daf70a84-c36c-11f0-a407-3a6d8ca4197d','f34b68fd-c362-11f0-a70f-0e5f7ebbeeec','39',0,0,'2025-11-17 04:21:14','2025-11-17 04:21:14'),('daf7db30-c36c-11f0-a407-3a6d8ca4197d','f34b68fd-c362-11f0-a70f-0e5f7ebbeeec','40',0,0,'2025-11-17 04:21:14','2025-11-17 04:21:14'),('daf8a86e-c36c-11f0-a407-3a6d8ca4197d','f34b68fd-c362-11f0-a70f-0e5f7ebbeeec','41',0,0,'2025-11-17 04:21:14','2025-11-17 04:21:14'),('daf970a0-c36c-11f0-a407-3a6d8ca4197d','f34b68fd-c362-11f0-a70f-0e5f7ebbeeec','42',0,0,'2025-11-17 04:21:14','2025-11-17 04:21:14'),('dafa2d6c-c36c-11f0-a407-3a6d8ca4197d','f34b68fd-c362-11f0-a70f-0e5f7ebbeeec','43',0,0,'2025-11-17 04:21:14','2025-11-17 04:21:14'),('dafacf8d-c36c-11f0-a407-3a6d8ca4197d','f34b68fd-c362-11f0-a70f-0e5f7ebbeeec','44',0,0,'2025-11-17 04:21:14','2025-11-17 04:21:14'),('dafb86ff-c36c-11f0-a407-3a6d8ca4197d','f34b68fd-c362-11f0-a70f-0e5f7ebbeeec','45',0,0,'2025-11-17 04:21:14','2025-11-17 04:21:14'),('dafc41c4-c36c-11f0-a407-3a6d8ca4197d','f34b68fd-c362-11f0-a70f-0e5f7ebbeeec','46',0,0,'2025-11-17 04:21:14','2025-11-17 04:21:14'),('e8705511-c38d-11f0-b555-6680711a0561','2d8c6024-c365-11f0-a70f-0e5f7ebbeeec','36',0,0,'2025-11-17 08:17:50','2025-11-17 08:17:50'),('e8713257-c38d-11f0-b555-6680711a0561','2d8c6024-c365-11f0-a70f-0e5f7ebbeeec','37',50,0,'2025-11-17 08:17:50','2025-11-17 08:17:50'),('e872042a-c38d-11f0-b555-6680711a0561','2d8c6024-c365-11f0-a70f-0e5f7ebbeeec','38',0,0,'2025-11-17 08:17:50','2025-11-17 08:17:50'),('e872e2d2-c38d-11f0-b555-6680711a0561','2d8c6024-c365-11f0-a70f-0e5f7ebbeeec','39',0,0,'2025-11-17 08:17:50','2025-11-17 08:17:50'),('e873b25e-c38d-11f0-b555-6680711a0561','2d8c6024-c365-11f0-a70f-0e5f7ebbeeec','40',0,0,'2025-11-17 08:17:50','2025-11-17 08:17:50'),('e8746162-c38d-11f0-b555-6680711a0561','2d8c6024-c365-11f0-a70f-0e5f7ebbeeec','41',0,0,'2025-11-17 08:17:50','2025-11-17 08:17:50'),('e8753a50-c38d-11f0-b555-6680711a0561','2d8c6024-c365-11f0-a70f-0e5f7ebbeeec','42',0,0,'2025-11-17 08:17:50','2025-11-17 08:17:50'),('e8760c1f-c38d-11f0-b555-6680711a0561','2d8c6024-c365-11f0-a70f-0e5f7ebbeeec','43',0,0,'2025-11-17 08:17:50','2025-11-17 08:17:50'),('e87762b7-c38d-11f0-b555-6680711a0561','2d8c6024-c365-11f0-a70f-0e5f7ebbeeec','44',0,0,'2025-11-17 08:17:50','2025-11-17 08:17:50'),('e8782996-c38d-11f0-b555-6680711a0561','2d8c6024-c365-11f0-a70f-0e5f7ebbeeec','45',0,0,'2025-11-17 08:17:50','2025-11-17 08:17:50'),('e878ae78-c38d-11f0-b555-6680711a0561','2d8c6024-c365-11f0-a70f-0e5f7ebbeeec','46',0,0,'2025-11-17 08:17:50','2025-11-17 08:17:50');
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
  `discount_price` decimal(10,2) DEFAULT NULL,
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
INSERT INTO `products` VALUES ('2d8c6024-c365-11f0-a70f-0e5f7ebbeeec','ayakkabı1','asdasd','asdasd',156.00,NULL,NULL,NULL,NULL,'3ded2992-c34e-11f0-a70f-0e5f7ebbeeec',NULL,1,0,0,NULL,NULL,'2025-11-17 03:26:17','2025-11-17 08:17:50'),('a7d4830b-c363-11f0-a70f-0e5f7ebbeeec','aaa','aaa','a',123.00,100.00,NULL,NULL,NULL,'f217b8b7-c336-11f0-8426-56042ea1cd39',NULL,1,0,0,NULL,NULL,'2025-11-17 03:15:23','2025-11-17 03:34:33'),('f34b68fd-c362-11f0-a70f-0e5f7ebbeeec','burak özdemir','burak-ozdemir','bok',3131.00,NULL,NULL,NULL,NULL,'f217b45d-c336-11f0-8426-56042ea1cd39',NULL,1,0,0,NULL,NULL,'2025-11-17 03:10:20','2025-11-17 03:10:20'),('fa054ccb-c361-11f0-a70f-0e5f7ebbeeec','ömer efe ceylan','omer-efe-ceylan','kandıralı',4140.99,NULL,NULL,NULL,NULL,'f217baf9-c336-11f0-8426-56042ea1cd39',NULL,1,0,0,NULL,NULL,'2025-11-17 03:03:22','2025-11-17 03:03:22');
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_line` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `postal_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
INSERT INTO `user_addresses` VALUES ('dffe397c-6271-4b23-91bf-18b787046a4d','180a725b-c351-11f0-a70f-0e5f7ebbeeec','abc','ömer ali','5511371796','istanbul','çekmeköy','ababababba','34569',1,'2025-11-17 04:35:06','2025-11-17 04:35:06');
/*!40000 ALTER TABLE `user_addresses` ENABLE KEYS */;
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

-- Dump completed on 2025-11-17  8:53:59
