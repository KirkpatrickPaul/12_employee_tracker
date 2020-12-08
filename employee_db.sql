DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE employees (
id INT AUTO_INCREMENT PRIMARY KEY
, first_name VARCHAR(30)
, last_name VARCHAR(45)
, role_id INT NOT NULL
, manager_id INT
);

CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY
  , name VARCHAR(45) NOT NULL
  , manager_id INT NOT NULL
  , CONSTRAINT fk_dept_manager_id
  FOREIGN KEY (manager_id) REFERENCES employees(id) 
  ON UPDATE CASCADE
  ON DELETE SET NULL
);

CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY
  , title VARCHAR(45) NOT NULL
  , department_id INT NOT NULL
  , CONSTRAINT fk_department_id
  FOREIGN KEY (department_id) REFERENCES departments(id)
  ON UPDATE CASCADE
  ON DELETE SET NULL
);

ALTER TABLE employees ADD CONSTRAINT fk_role_id
FOREIGN KEY (role_id) REFERENCES roles(id)
  ON UPDATE CASCADE
  ON DELETE SET NULL;
  
ALTER TABLE employees ADD CONSTRAINT fk_empl_manager_id
FOREIGN KEY (manager_id) REFERENCES employees(id)
  ON UPDATE CASCADE
  ON DELETE SET NULL;