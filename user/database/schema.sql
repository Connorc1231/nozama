DROP DATABASE IF EXISTS nozama;
CREATE DATABASE nozama;
USE nozama;

CREATE TABLE `users`(
 `user_id` INTEGER NOT NULL AUTO_INCREMENT,
 `name` VARCHAR(50) NOT NULL,
 `email` VARCHAR(50) NOT NULL,
 `password` VARCHAR(256) NOT NULL,
 PRIMARY KEY(`user_id`)
);

CREATE TABLE `user_details`(
 `user_details_id` INTEGER NOT NULL AUTO_INCREMENT,
 `user_id` INTEGER NOT NULL,
 `zip` INTEGER NOT NULL,
 `state` VARCHAR(2) NOT NULL,
 `gender` VARCHAR(1) NOT NULL,
 `age` INTEGER NOT NULL,
 `subscription_type` VARCHAR(1) NOT NULL,
 PRIMARY KEY(`user_details_id`),
 FOREIGN KEY (`user_id`) REFERENCES users(`user_id`)
);

CREATE TABLE `user_orders`(
 `order_id` INTEGER NOT NULL AUTO_INCREMENT,
 `product_id` INTEGER NOT NULL,
 `order_placed_at` DATE NOT NULL,
 `price` INTEGER NOT NULL,
 `user_id` INTEGER NOT NULL,
 PRIMARY KEY(`order_id`),
 FOREIGN KEY (`user_id`) REFERENCES users(`user_id`)
);

CREATE TABLE `user_social_media`(
 `social_media_id` INTEGER NOT NULL AUTO_INCREMENT,
 `user_id` INTEGER NOT NULL,
 `facebook_url` VARCHAR(50) NULL,
 `twitter_url` VARCHAR(50) NULL,
 `instagram_url` VARCHAR(50) NULL,
 PRIMARY KEY(`social_media_id`),
 FOREIGN KEY (`user_id`) REFERENCES users(`user_id`)
);

CREATE TABLE `user_wishlist`(
 `user_wishlist_id` INTEGER NOT NULL AUTO_INCREMENT,
 `user_id` INTEGER NOT NULL,
 `product_id` INTEGER NOT NULL,
 `created_at` DATE NOT NULL,
 `related_items` VARCHAR(50) NULL,
 PRIMARY KEY(`user_wishlist_id`),
 FOREIGN KEY (`user_id`) REFERENCES users(`user_id`)
);