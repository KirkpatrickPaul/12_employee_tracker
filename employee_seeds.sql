-- To  make these inserts work, I did this before the ALTER TABLE portion of employee_db.sql
--Alternately, a person could ALTER TABLE DROP CONSTRAINT fk_role_id and fk_empl_manager_id

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Morgan", "Freeman", 1, NULL), ("Fred", "Savage", 2, 1), ("Whoopi", "Goldberg", 3, 1), ("Mark", "Wahlberg", 4, 2), ("Tom", "Cruise", 5, 3), ("Winona", "Rider", 5, 5), ("Daniel", "Radcliffe", 5, 5);

INSERT INTO departments (name, manager_id)
VALUES ("Executive Office", 1), ("Finances", 2), ("Operations", 3), ("Cleaning", 5);

INSERT INTO roles (title, department_id)
VALUES ("Chief Executive Officer", 1), ("Chief Financial Officer", 1), ("Chief Operations Officer"), ("Accounting Intern", 2), ("Chief Toilet Scrubber", 4), ("Toilet Scrubbing Intern", 4);
