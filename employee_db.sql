DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE employees (
id INT AUTO_INCREMENT PRIMARY KEY
, first_name VARCHAR(30)
, last_name VARCHAR(45)
, role_id INT NOT NULL REFERENCES roles(id)
);

CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY
  , name VARCHAR(45) NOT NULL
  , manager_id INT NOT NULL REFERENCES employees(id)
);

CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY
  , title VARCHAR(45) NOT NULL
  , department_id INT NOT NULL REFERENCES departments(id)
);