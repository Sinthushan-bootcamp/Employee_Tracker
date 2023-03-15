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

function addEmployee() {
    
}

function updateEmployee() {
    
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