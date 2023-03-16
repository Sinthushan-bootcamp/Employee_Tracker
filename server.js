const inquirer = require("inquirer");
const mysql = require('mysql2');
const cTable = require('console.table');


// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'wilmott2',
      database: 'company_db'
    },
);

function startPrompt(){
    inquirer
        .prompt([
            {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'Quit',
            ],
            },
        ])
        .then((data) => {
            if (data.action !== 'Quit'){
                actions[data.action]()
            }
        })
        .catch((error) => {
            console.log(error);
            startPrompt()
        });
}

function viewAllEmployees() {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department,role.salary, CONCAT(managers.first_name, ' ', managers.last_name) AS 'manager'  
              FROM employee 
              LEFT JOIN role on employee.role_id = role.id
              LEFT JOIN department on role.department_id = department.id
              LEFT JOIN employee managers on employee.manager_id = managers.id`,
              function (err, results) {
                const table = cTable.getTable(results);
                console.log(table);
                startPrompt()
            });
}

async function addEmployee() {
    const [roleRows,rolefields] = await db.promise().query( 'SELECT * FROM role');
    roles = roleRows.map(roleRow => roleRow['title'])
    const [employeeRows,employeefields] = await db.promise().query( 'SELECT * FROM employee');
    employees = employeeRows.map(employeeRow => employeeRow['first_name'] + ' ' + employeeRow['last_name'])
    employees.unshift('none')
    inquirer
        .prompt([
            {
            type: 'input',
            name: 'first_name',
            message: 'What is the first name of the employee?',
            },
            {
            type: 'input',
            name: 'last_name',
            message: 'What is the last name of the employee?',
            },
            {
            type: 'list',
            name: 'role',
            message: 'What is the employee\'s roles?',
            choices: roles,
            },
            {
            type: 'list',
            name: 'manager',
            message: 'Who is the employee\'s manager?',
            choices: employees,
            },
        ])
        .then((data) => {
            role_id = roleRows.filter(roleRow => roleRow['title'] === data.role)[0]['id']
            manager_id = employeeRows.filter(employeeRow => employeeRow['first_name'] + ' ' + employeeRow['last_name'] === data.manager)[0]['id']
            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                          VALUES (?,?,?, ?)`,  [data.first_name, data.last_name, role_id, manager_id],
                          function (err, results) {
                            console.log(`Added ${data.first_name + " " + data.last_name} to the database`)
                            startPrompt()
                    });
        })
        .catch((error) => {
            console.log(error);
            startPrompt()
        });

}

async function updateEmployee() {
    const [roleRows,rolefields] = await db.promise().query( 'SELECT * FROM role');
    roles = roleRows.map(roleRow => roleRow['title'])
    const [employeeRows,employeefields] = await db.promise().query( 'SELECT * FROM employee');
    employees = employeeRows.map(employeeRow => employeeRow['first_name'] + ' ' + employeeRow['last_name'])
    employees.unshift('none')
    inquirer
        .prompt([
            {
            type: 'list',
            name: 'employee',
            message: 'Which employee\'s role would you like to update?',
            choices: employees,
            },
            {
            type: 'list',
            name: 'role',
            message: 'Which role do you want to assign the selected employee?',
            choices: roles,
            },
        ])
        .then((data) => {
            role_id = roleRows.filter(roleRow => roleRow['title'] === data.role)[0]['id']
            employee_id = employeeRows.filter(employeeRow => employeeRow['first_name'] + ' ' + employeeRow['last_name'] === data.employee)[0]['id']
            db.query(`UPDATE employee SET role_id = ? WHERE id = ?`,  [role_id, employee_id],
                          function (err, results) {
                            console.log(`Updated employee's role`)
                            startPrompt()
                    });
        })
        .catch((error) => {
            console.log(error);
            startPrompt()
        });
}

function viewAllRoles() {
    db.query(`SELECT role.id, role.title, department.name as department, role.salary 
              FROM role
              LEFT JOIN department on role.department_id = department.id`, 
              function (err, results) {
                const table = cTable.getTable(results);
                console.log(table);
                startPrompt()
            });
}

function addRole() {
    db.query('SELECT * FROM department', function (err, results) {
        choices = results.map(result => result['name'])
        inquirer
        .prompt([
            {
            type: 'input',
            name: 'role',
            message: 'What is the name of the role?',
            },
            {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?',
            },
            {
            type: 'list',
            name: 'department',
            message: 'Which department does the role belong to?',
            choices: choices,
            },
        ])
        .then((data) => {
            department_id = results.filter(result => result['name'] === data.department)[0]['id']
            db.query(`INSERT INTO role (title, salary, department_id)
                          VALUES (?,?,?)`,  [data.role, data.salary, department_id],
                          function (err, results) {
                            console.log(`Added ${data.role} to the database`)
                            startPrompt()
                    });
        })
        .catch((error) => {
            console.log(error);
            startPrompt()
        });

    });
}

function viewAllDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
        const table = cTable.getTable(results);
        console.log(table);
        startPrompt()
    });
}

function addDepartment() {
    inquirer
        .prompt([
            {
            type: 'input',
            name: 'departmentName',
            message: 'What is the name of the department',
            },
        ])
        .then((data) => {
            departmentName = data.departmentName.trim()
            if (departmentName){
                db.query(`INSERT INTO department (name)
                          VALUES (?)`,  departmentName,
                          function (err, results) {
                            console.log(`Added ${departmentName} to the database`)
                            startPrompt()
                        });
            }

        })
        .catch((error) => {
            console.log(error);
            startPrompt()
        });
}


const actions = {
    'View All Employees': viewAllEmployees,
    'Add Employee': addEmployee,
    'Update Employee Role': updateEmployee,
    'View All Roles': viewAllRoles,
    'Add Role': addRole,
    'View All Departments': viewAllDepartments,
    'Add Department': addDepartment
}

startPrompt()