INSERT INTO department (name)
VALUES
  ('Sales'),
  ('Engineering');


INSERT INTO role (title, salary, department_id)
VALUES
  ('Sales Rep', 10, 1),
  ('Engineer', 20, 2);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('David', 'Tait', 2, NULL),
  ('Elizabeth', 'Tait', 1, 1);