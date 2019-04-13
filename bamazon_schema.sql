DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
    item_id integer not null auto_increment,
    product_name varchar(50),
    department_name varchar(30),
    price decimal(10,2),
    stock_quantity integer,
    primary key(item_id)
);