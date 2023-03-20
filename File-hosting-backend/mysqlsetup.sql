CREATE DATABASE IF NOT EXISTS `FileHosterDB`;

USE FileHosterDB;

CREATE TABLE IF NOT EXISTS Users (
    Userid int NOT NULL AUTO_INCREMENT,
    username varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    PRIMARY KEY (Userid)
);

CREATE TABLE IF NOT EXISTS Uploads (
    Uploadid int NOT NULL AUTO_INCREMENT,
    file_name varchar(255),
    upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    description varchar(255),
    file varchar(255),
    Userid int NOT NULL,
    PRIMARY KEY (Uploadid),
    FOREIGN KEY (Userid) REFERENCES Users(Userid)
);
