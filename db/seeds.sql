INSERT INTO department (name)
VALUES ("Management"),
       ("Engineer"),
       ("Design"),
       ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES ("Principal", 250000, 1),
       ("Project Manager", 150000, 1),
       ("Software Engineer", 150000, 2),
       ("UX Designer", 120000, 3),
       ("UI Designer", 100000, 3),
       ("Accountant", 100000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL),
       ("Mike", "Brown", 2, 1),
       ("Andrew", "Peters", 2, 1),
       ("Kristi", "Muller", 3, 2),
       ("Ada", "Elmalik", 3, 2),
       ("Angela", "Wang", 4, 3),
       ("Kentrell", "Almo", 5, 3),
       ("Oliver", "Dam", 6, 1);
