const inquirer = require("inquirer");
const actions = require('./util');


// initial prompt to ask the user what the want to do
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
                // the keys of the actions object map to the possible replies and have the appropriate function as a value
                actions[data.action](startPrompt) 
            }
        })
        .catch((error) => {
            console.log(error);
            startPrompt()
        });
}
// start program
startPrompt()