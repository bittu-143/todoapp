CREATE DATABASE todoapp;
\connect todoapp;
CREATE TABLE todos(
    id VARCHAR(255) primary key,
    user_email VARCHAR(255),
    title VARCHAR(30),
    progress int,
    date VARCHAR(300)
);

CREATE TABLE users(
    email VARCHAR(255) primary key,
    hashed_password VARCHAR(255)
);

