CREATE DATABASE drisk_db;

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `active` bit(1) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `drisk_db`.`users` (`user_id`, `active`, `email`, `password`, `user_name`) VALUES ('1','1','admin','$2a$10$Ga3PJW1eQWG4QhsPNUoGr.3eAg7rImrxHcXINPbB02cZt29yBSN.e','admin');
