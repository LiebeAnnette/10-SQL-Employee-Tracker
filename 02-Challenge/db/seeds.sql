-- TRUNCATE TABLE department RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE roles RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE employee RESTART IDENTITY CASCADE;

INSERT INTO department (department_name)
VALUES  ('Engineering'),
        ('Finance'),
        ('Legal'),
        ('Sales');

INSERT INTO roles (title, salary, department_id)
VALUES  ('Sales Lead', 80000, 4),
        ('Salesperson', 70000, 4),
        ('Lead Engineer', 90000, 1),
        ('Software Engineer', 80000, 1),
        ('Account Manager', 60000, 2),
        ('Accountant', 50000, 2),
        ('Legal Team Lead', 90000, 3),
        ('Lawyer', 100000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Stephen', 'Tobolowsky', 1, NULL),
        ('Marita', 'Geraghty', 2, 1),
        ('Bill', 'Murray', 3, NULL),
        ('Andie', 'McDowell', 4, 3),
        ('Harold', 'Ramis', 5, NULL),
        ('Chris', 'Elliot', 6, 5);
