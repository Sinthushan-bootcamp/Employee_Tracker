const db = require('../config/connection.js');
const cTable = require('console.table');
const inquirer = require("inquirer");

/**
 * Gets data for all employee from MySQL database and then run the callback function
 * @param {requestCallback} callback - The callback that handles the response.
 */
function viewAllEmployees(callback) {
    // joining all three tables as well as doing a self join to get the manager, we use a left join since not all employees have a manager
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department,role.salary, CONCAT(managers.first_name, ' ', managers.last_name) AS 'manager'  
              FROM employee 
              LEFT JOIN role on employee.role_id = role.id
              LEFT JOIN department on role.department_id = department.id
              LEFT JOIN employee managers on employee.manager_id = managers.id`,
              function (err, results) {
                const table = cTable.getTable(results); //use ctable to turn results into tabular format
                console.log(table);
                callback()
            });
}

/**
 * Adds an Employee to the MySQL employee table and then calls the callback
 * @param {requestCallback} callback - The callback that handles the response.
 */
async function addEmployee(callback) {
    // getting all roles so we can display them as choices for user so they can choose the role for the new employee
    const [roleRows,rolefields] = await db.promise().query( 'SELECT * FROM role'); 
    roles = roleRows.map(roleRow => roleRow['title']) //making a list of just the role titles

    // getting all employees so we can display them as choices for user so they can choose a manager for the new employee
    const [employeeRows,employeefields] = await db.promise().query( 'SELECT * FROM employee');
    employees = employeeRows.map(employeeRow => employeeRow['first_name'] + ' ' + employeeRow['last_name']) // making a list of concatenated first and last names
    employees.unshift('none') // adding none to the front of the employee list so that users can have an option to not give their employees a manager
    // prompt user to get first name, last name, role, and manager
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
            role_id = roleRows.filter(roleRow => roleRow['title'] === data.role)[0]['id'] // get the id of the selected role
            manager_id = null; // set the manager ID to null
            if (data.manager != 'none') { // if the user selected a manger change manager_id to the employee id of the user selection
                manager_id = employeeRows.filter(employeeRow => employeeRow['first_name'] + ' ' + employeeRow['last_name'] === data.manager)[0]['id']
            }
            // insert the new employee into the employee table
            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                          VALUES (?,?,?,?)`,  [data.first_name, data.last_name, role_id, manager_id],
                          function (err, results) {
                            console.log(`Added ${data.first_name + " " + data.last_name} to the database`)
                            callback()
                    });
        })
        .catch((error) => {
            console.log(error);
            callback()
        });

}

/**
 * Update an employee in the employee table and then calls the callback
 * @param {requestCallback} callback - The callback that handles the response.
 */
async function updateEmployee(callback) {
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
                            callback()
                    });
        })
        .catch((error) => {
            console.log(error);
            callback()
        });
}

/**
 * Retrieves all available role in the database and then calls the callback
 * @param {requestCallback} callback - The callback that handles the response.
 */
function viewAllRoles(callback) {
    // joining roles and department to get role ID, title and full department name instead of department ID and role salary
    db.query(`SELECT role.id, role.title, department.name as department, role.salary 
              FROM role
              LEFT JOIN department on role.department_id = department.id`, 
              function (err, results) {
                const table = cTable.getTable(results);
                console.log(table);
                callback()
            });
}

/**
 * adds a new role to the database and then calls the callback
 * @param {requestCallback} callback - The callback that handles the response.
 */
function addRole(callback) {
    // select all departments to give choices for prompt
    db.query('SELECT * FROM department', function (err, results) {
        choices = results.map(result => result['name'])
        // prompt user to get the title of the role, the salary, and the department
        inquirer
        .prompt([
            {
            type: 'input',
            name: 'role',
            message: 'What is the title of the role?',
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
            department_id = results.filter(result => result['name'] === data.department)[0]['id'] //get department id from department name
            db.query(`INSERT INTO role (title, salary, department_id)
                          VALUES (?,?,?)`,  [data.role, data.salary, department_id],
                          function (err, results) {
                            console.log(`Added ${data.role} to the database`)
                            callback()
                    });
        })
        .catch((error) => {
            console.log(error);
            callback()
        });

    });
}

/**
 * gets all departments available in the database and then calls the callback
 * @param {requestCallback} callback - The callback that handles the response.
 */
function viewAllDepartments(callback) {
    // get all departments available in the database
    db.query('SELECT * FROM department', function (err, results) {
        const table = cTable.getTable(results);
        console.log(table);
        callback()
    });
}

/**
 * adds a new department to the database and then calls the callback
 * @param {requestCallback} callback - The callback that handles the response.
 */
function addDepartment(callback) {
    // prompt user for department name
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
            // insert new department into the database
            if (departmentName){
                db.query(`INSERT INTO department (name)
                          VALUES (?)`,  departmentName,
                          function (err, results) {
                            console.log(`Added ${departmentName} to the database`)
                            callback()
                        });
            }

        })
        .catch((error) => {
            console.log(error);
            callback()
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

module.exports = actions;

