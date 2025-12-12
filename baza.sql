DROP DATABASE `planinska_vikendica`;

CREATE DATABASE `planinska_vikendica`;

USE `planinska_vikendica`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `gender` char(1) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `mail` varchar(100) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `card` varchar(50) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
);

CREATE TABLE `cottages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `owner` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `services` text,
  `price_summer` decimal(10,2) NOT NULL,
  `price_winter` decimal(10,2) NOT NULL,
  `price_weekday` decimal(10,2) NOT NULL,
  `price_weekend` decimal(10,2) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `coord_x` decimal(10,7) DEFAULT NULL,
  `coord_y` decimal(10,7) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `owner` (`owner`),
  CONSTRAINT `cottages_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `users` (`id`) ON DELETE CASCADE
);


CREATE TABLE `cottage_pictures` (
  `id` int NOT NULL AUTO_INCREMENT,
  `picture` varchar(255) NOT NULL,
  `cottage` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cottage` (`cottage`),
  CONSTRAINT `cottage_pictures_ibfk_1` FOREIGN KEY (`cottage`) REFERENCES `cottages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tourist` int NOT NULL,
  `cottage` int NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `adults` int NOT NULL,
  `children` int NOT NULL,
  `card_used` varchar(50) NOT NULL,
  `description` text,
  `res_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tourist` (`tourist`),
  KEY `cottage` (`cottage`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`tourist`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`cottage`) REFERENCES `cottages` (`id`) ON DELETE CASCADE
);

CREATE TABLE `reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `booking` int NOT NULL,
  `status` enum('neobradjena','prihvacena','odbijena','zavrsena') NOT NULL DEFAULT 'neobradjena',
  `rejection_reason` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `booking` (`booking`),
  CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`booking`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
);

CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reservation` int NOT NULL,
  `comment` text,
  `rating` int NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
  PRIMARY KEY (`id`),
  KEY `reservation` (`reservation`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`reservation`) REFERENCES `reservations` (`id`) ON DELETE CASCADE
);



INSERT INTO `users` VALUES
(1,'tamarar','$2a$12$Q8blTiu6jKiVOwOQZWji2uXWCI9LFecqzz5R5.h2vxa.L6GcHYwDS','Tamara','Radojčić','Ž','Beograd, Srbija','0612345678','tamara@gmail.com','i2.jpg','300012300000001','vlasnik', 'aktivan'),
(2,'miljan','$2a$12$cKMZzui2sMz1bVCV8jaCVOi5VC6882zWxmj78nzPW.ZytSmIiH5P.','Miljan','Vojvodic','M','Novi Sad, Srbija','0698765432','miljan@gmail.com','i3.jpg','4539123456789012','turista', 'aktivan'),
(3,'anas','$2a$12$YOrggu13Q3evDcdFDuuHS.byPHLXEASOUNToumljSbKcpoQF4XluK','Ana','Stanković','Ž','Niš, Srbija','0601122334','ana@gmail.com','i3.jpg','5112345678901234','admin', 'aktivan'),
(4,'marija','$2a$12$pyFT/O0ukjBhvx9lXAFr.uEyA8rR5E9ZRchna0UZoTyJN5J01sr.a','Marija','Maric','Ž','Adresica Malenica 32','0635503551','marija@gmail.com','unknownuser.jpg','5112345678901234','vlasnik', 'aktivan');
-- za admina je Anas123.

INSERT INTO `cottages` VALUES
(1,1,'Zlatiborska idila','Zlatibor','Sauna, pogled na planinu, roštilj',4500.00,4000.00,4200.00,4600.00,'0601234567',43.7266,19.6954, 'aktivna'),
(2,1,'Kopaonik Lux','Kopaonik','Spa centar, bazen, garaža, bilijar',12000.00,11000.00,11500.00,12500.00,'0621234567',43.2771,20.8045, 'aktivna'),
(3,1,'Vikendica Drina','Perućac','Pogled na reku, čamac, terasa, roštilj',7000.00,6500.00,6800.00,7200.00,'0631234567',43.9510,19.4025, 'aktivna'),
(4,1,'Planinska oaza','Ivanjica','Parking, SPA, kamin',8000.00,7500.00,7700.00,8200.00,'0611234567',43.5662,19.8681, 'aktivna'),
(5,4,'Fruška terasa','Fruška Gora','WiFi, sauna, pogled na šumu, roštilj',5000.00,4500.00,4700.00,5200.00,'0601234567',45.1234,19.7241, 'aktivna'),
(6,1,'Mokra vila','Mokra Gora','Kamin, terasa, reka u blizini',4800.00,4300.00,4500.00,5000.00,'0601234567',43.8633,19.6839, 'aktivna'),
(7,1,'Sunčani raj Zlatara','Zlatar','Veliki vrt, pogled na jezero, roštilj',5500.00,5000.00,5200.00,5700.00,'0601234567',43.7856,19.8952, 'aktivna');

INSERT INTO `cottage_pictures` VALUES
(1,'logo2.jpg',1),(2,'logo1.png',1),
(3,'cot11.jpg',2),(4,'cot12.jpg',2),
(5,'unknowncottage.jpg',3),
(6,'cot2.jpg',4),(7,'cot11.jpg',4),(8,'cot12.jpg',4),
(9,'cotm1.jpg',5),
(10,'cot31.jpg',6),(11,'cot32.jpg',6),
(12,'cotm2.jpg',7);

-- Bookings
INSERT INTO `bookings` (`tourist`, `cottage`, `start_date`, `end_date`, `adults`, `children`, `card_used`, `description`, `res_date`) VALUES
(2, 1, '2025-08-05', '2025-08-10', 2, 0, '400012340000002', 'Summer trip to Zlatibor', '2025-07-20'),
(2, 3, '2025-09-01', '2025-09-05', 1, 1, '400012340000003', 'Weekend spa escape', '2025-08-15'),
(2, 4, '2025-09-10', '2025-09-15', 2, 2, '400012340000004', 'Family trip', '2025-08-25'),
(2, 5, '2025-08-20', '2025-08-22', 1, 0, '400012340000005', 'Quick getaway', '2025-08-01'),
(2, 6, '2025-09-18', '2025-09-20', 2, 1, '400012340000006', 'Nature weekend', '2025-09-05'),

(2, 1, '2025-10-22', '2025-10-25', 2, 0, '300012300000001', 'Weekend escape', '2025-10-10'),
(3, 3, '2025-10-23', '2025-10-28', 2, 1, '400012340000002', 'Spa vacation', '2025-10-12'),
(4, 4, '2025-11-01', '2025-11-05', 1, 0, '400012340000003', 'Short family trip', '2025-10-15');

-- Reservations (one per booking, all completed so we can have reviews)
INSERT INTO `reservations` (`booking`, `status`, `rejection_reason`) VALUES
(1, 'zavrsena', NULL),
(2, 'zavrsena', NULL),
(3, 'odbijena', 'Preklapanje sa drugim gostom'),
(4, 'zavrsena', NULL),
(5, 'zavrsena', NULL),

(6, 'neobradjena', NULL),
(7, 'prihvacena', NULL),
(8, 'neobradjena', NULL);

-- Reviews (tourist 2 leaves rating + comment)
INSERT INTO `reviews` (`reservation`, `rating`, `comment`) VALUES
(1, 5, 'Amazing stay, highly recommend!'),
(2, 4, 'Very nice, spa was great.'),
(4, 5, 'Kids loved it, great family experience.'),
(5, 3, 'Cozy place, but heating could be better.'),
(1, 3, 'Cozy place, but heating could be better.'),
(1, 4, 'Beautiful surroundings, enjoyed it.'),
(1, 5, 'Perfect weekend, very relaxing.'),
(1, 4, 'Great location, will visit again.');

-----------------------------------------------------------------------------------------------------------

DROP DATABASE `planinska_vikendica`;

CREATE DATABASE `planinska_vikendica`;

USE `planinska_vikendica`;

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `mail` varchar(255) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `card` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'tamarar','$2a$12$Q8blTiu6jKiVOwOQZWji2uXWCI9LFecqzz5R5.h2vxa.L6GcHYwDS','Tamara','Radojčić','Ž','Beograd, Srbija','0612345678','tamara@gmail.com','i2.jpg','300012300000001','vlasnik','aktivan'),(2,'miljan','$2a$12$cKMZzui2sMz1bVCV8jaCVOi5VC6882zWxmj78nzPW.ZytSmIiH5P.','Miljan','Vojvodic','M','Novi Sad, Srbija','0698765432','miljan@gmail.com','i3.jpg','4539123456789012','turista','aktivan'),(3,'anas','$2a$12$YOrggu13Q3evDcdFDuuHS.byPHLXEASOUNToumljSbKcpoQF4XluK','Ana','Stanković','Ž','Niš, Srbija','0601122334','ana@gmail.com','i3.jpg','5112345678901234','admin','aktivan'),(4,'marija','$2a$12$pyFT/O0ukjBhvx9lXAFr.uEyA8rR5E9ZRchna0UZoTyJN5J01sr.a','Marija','Maric','Ž','Adresica Malenica 32','0635503551','marija@gmail.com','i5.jpg','5112345678901234','vlasnik','aktivan'),(5,'pera','$2a$12$ZQ4hYBQjIDOwG0GaTaq5tuSK.ycOeaJp3lGjs7bNOfFzU5YSI8XY.','Pera','Peric','M','Bulevar kralja Aleksandra','0635503551','pera@gmail.com','unknownuser.jpg','300000000000001','turista','aktivan'),(7,'maja','$2a$12$GErlN3pnSxEn2jOJ9GFrdORbGx30TpW6L/IEUmhzutFGq.rwT5SP.','Maja','Mikic','Ž','Stanka Paunovica 23','069876543','maja@gmail.com','unknownuser.jpg','4539123444777012','turista','neobradjen');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `cottages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cottages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `owner` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `services` varchar(255) DEFAULT NULL,
  `price_summer` float DEFAULT NULL,
  `price_winter` float DEFAULT NULL,
  `price_weekday` float DEFAULT NULL,
  `price_weekend` float DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `coord_x` float DEFAULT NULL,
  `coord_y` float DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `owner` (`owner`),
  CONSTRAINT `cottages_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cottages`
--

LOCK TABLES `cottages` WRITE;
/*!40000 ALTER TABLE `cottages` DISABLE KEYS */;
INSERT INTO `cottages` VALUES (1,1,'Zlatiborska idila','Zlatibor','Sauna, pogled na planinu, roštilj',4500,4000,4200,4600,'0601234567',43.7266,19.6954,'aktivna'),(2,1,'Kopaonik Lux','Kopaonik','Spa centar, bazen, garaža, bilijar',12000,11000,11500,12500,'0621234567',43.2771,20.8045,'aktivna'),(3,1,'Vikendica Drina','Perućac','Pogled na reku, čamac, terasa, roštilj',7000,6500,6800,7200,'0631234567',43.951,19.4025,'aktivna'),(4,1,'Planinska oaza','Ivanjica','Parking, SPA, kamin',8000,7500,7700,8200,'0611234567',43.5662,19.8681,'aktivna'),(5,4,'Fruška terasa','Fruška Gora','WiFi, sauna, pogled na šumu, roštilj',5000,4500,4700,5200,'0601234567',45.1234,19.7241,'aktivna'),(6,4,'Mokra vila','Mokra Gora','Kamin, terasa, reka u blizini',4800,4300,4500,5000,'0601234567',43.8633,19.6839,'aktivna'),(7,4,'Sunčani raj Zlatara','Zlatar','Veliki vrt, pogled na jezero, roštilj',5500,5000,5200,5700,'0601234567',43.7856,19.8952,'aktivna'),(8,1,'Moja lepa Gora','Fruška Gora','Terasa, roštilj, bazen',5000,3500,4000,4500,'0601234567',45.152,19.791,'aktivna');
/*!40000 ALTER TABLE `cottages` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `cottage_pictures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cottage_pictures` (
  `id` int NOT NULL AUTO_INCREMENT,
  `picture` varchar(255) NOT NULL,
  `cottage` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cottage` (`cottage`),
  CONSTRAINT `cottage_pictures_ibfk_1` FOREIGN KEY (`cottage`) REFERENCES `cottages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cottage_pictures`
--

LOCK TABLES `cottage_pictures` WRITE;
/*!40000 ALTER TABLE `cottage_pictures` DISABLE KEYS */;
INSERT INTO `cottage_pictures` VALUES (1,'logo2.jpg',1),(2,'logo1.png',1),(3,'cot11.jpg',2),(4,'cot12.jpg',2),(5,'unknowncottage.jpg',3),(9,'cotm1.jpg',5),(10,'cot31.jpg',6),(11,'cot32.jpg',6),(12,'cot41.jpg',8),(13,'cot42.jpg',8),(14,'cot51.jpg',4),(15,'cot52.jpg',4),(16,'cot53.jpg',4),(17,'unknowncottage.jpg',7);
/*!40000 ALTER TABLE `cottage_pictures` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tourist` int NOT NULL,
  `cottage` int NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `adults` int NOT NULL,
  `children` int NOT NULL,
  `card_used` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `res_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tourist` (`tourist`),
  KEY `cottage` (`cottage`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`tourist`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`cottage`) REFERENCES `cottages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,2,1,'2025-08-05 00:00:00','2025-08-10 00:00:00',2,0,'400012340000002','Letnji odmor na Zlatiboru','2025-07-20 00:00:00'),(2,2,3,'2025-09-01 00:00:00','2025-09-05 00:00:00',1,1,'400012340000003','Beg u spa za vikend','2025-08-15 00:00:00'),(3,2,4,'2025-09-10 00:00:00','2025-09-15 00:00:00',2,2,'400012340000004','Porodicni odmor','2025-08-25 00:00:00'),(4,2,5,'2025-08-20 00:00:00','2025-08-22 00:00:00',1,0,'400012340000005','Beg u prirodu','2025-08-01 00:00:00'),(5,2,6,'2025-09-18 00:00:00','2025-09-20 00:00:00',2,1,'400012340000006','Dugi iscekivani vikend u prirodi','2025-09-05 00:00:00'),(7,3,3,'2025-10-23 00:00:00','2025-10-28 00:00:00',2,1,'400012340000002','Spa odmor','2025-10-12 00:00:00'),(8,4,4,'2025-11-01 00:00:00','2025-11-05 00:00:00',1,0,'400012340000003','Kratak porodicni odmor','2025-10-15 00:00:00'),(9,2,8,'2025-10-30 15:30:00','2025-11-03 07:30:00',4,4,'4539123456789012','Dve porodice sa decom.','2025-10-20 17:32:57'),(10,5,6,'2025-10-20 20:00:00','2025-10-25 06:00:00',1,0,'300000000000001','Pisem knjigu.','2025-10-20 17:53:55'),(11,5,7,'2025-10-21 22:00:00','2025-10-25 06:00:00',1,0,'300000000000001',' ','2025-10-20 18:00:00'),(12,4,4,'2025-11-01 00:00:00','2025-11-05 00:00:00',1,0,'4539123456789012','Kratko putovanje','2025-10-15 00:00:00'),(13,2,2,'2025-11-16 13:30:00','2025-11-22 08:00:00',2,1,'4539123456789012','','2025-10-21 11:39:34'),(14,2,1,'2025-10-24 13:40:00','2025-10-25 06:45:00',10,0,'4539123456789012','Slavljenje rodjendana','2025-10-21 11:40:38'),(15,2,7,'2025-09-09 00:00:00','2025-09-10 00:00:00',2,0,'300000000000001','Odmor','2025-09-05 00:00:00'),(16,5,7,'2025-09-09 00:00:00','2025-09-10 00:00:00',2,0,'300000000000001','','2025-09-04 00:00:00'),(17,5,7,'2025-09-10 00:00:00','2025-09-01 00:00:00',2,0,'300000000000001','Drugi pokusaj zakazivanja','2025-09-05 00:00:00');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `booking` int NOT NULL,
  `status` varchar(255) NOT NULL,
  `rejection_reason` text,
  PRIMARY KEY (`id`),
  KEY `booking` (`booking`),
  CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`booking`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (1,1,'zavrsena',NULL),(2,2,'zavrsena',NULL),(3,3,'odbijena','Preklapanje sa drugim gostom'),(4,4,'zavrsena',NULL),(5,5,'zavrsena',NULL),(7,7,'prihvacena',NULL),(8,8,'neobradjena',NULL),(9,9,'prihvacena',NULL),(10,10,'prihvacena',NULL),(11,11,'prihvacena',NULL),(12,12,'neobradjena',NULL),(13,13,'neobradjena',NULL),(14,14,'neobradjena',NULL),(15,15,'zavrsena',NULL),(16,16,'zavrsena',NULL),(17,17,'zavrsena',NULL);
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reservation` int NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `rating` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `reservation` (`reservation`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`reservation`) REFERENCES `reservations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,'Divan prostor, sve preporuke!',5),(2,2,'Prelepo, spa je bio sjajan',4),(3,4,'Detetu se jako svidelo, divan porodicni odmor.',5),(4,5,'Lepo i udobno, ali grejanje je moglo biti bolje',3),(9,15,'Vlasnik nije bio na lokaciji',1),(10,16,'Nismo se dogovorili kako treba',1),(11,17,'Vlasnik se nije javljao na telefon',1);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;