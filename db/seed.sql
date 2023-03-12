INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("HR");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Assistant", 40000.00,1),
       ("Sales Manager", 80000.00,1),
       ("Junior Developer",60000.00,2),
       ("Staff Engineer", 140000.00,2),
       ("Analyst", 75000.00,3),
       ("HR Officer", 65000,4),
       ("Head of HR Compliance", 150000.00,4),
       ("CFO", 210000.00,3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jeff", "Jefferson", 2, NULL),
       ("John", "Jhonson", 4, NULL),
       ("William", "Williamson",7, NULL),
       ("Tom", "Thomson",8, NULL),
       ("Joey", "Santiago",1,1),
       ("Kim", "Deal",6,3),
       ("David", "Lovering",5,4);