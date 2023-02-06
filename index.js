// dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');
const Queries = require('./lib/query');

// create the connection
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'myBusiness_db',
},
    console.log(`Connected to the myBusiness_db database.`),
);

// main questions
const init = async () => {
    try {
        let mainOptions = await inquirer.prompt([
            {
                name: 'dashboard',
                type: 'list',
                message: 'What do you want to do?',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'I am done'
                ],
            }
        ]);
        option(mainOptions.dashboard);
    } catch (error) {
        alert(error);
    }
};

// different options in mainOptions
const option = async (mainOptions) => {

    if (mainOptions === 'View all departments') {
        viewDepartment();
    }
    else if (mainOptions === 'View all roles') {
        viewRole();
    }
    else if (mainOptions === 'View all employees') {
        viewEmployees();
    }
    else if (mainOptions === 'Add a department') {
        addDepartment();
    }
    else if (mainOptions === 'Add a role') {
        addRole();
    }
    else if (mainOptions === 'Add an employee') {
        addEmployee();
    }
    else if (mainOptions === 'Update an employee role') {
        updateEmRole();
    }
    else if (mainOptions === 'I am done') {
        console.log('Have a good day!')
        connection.end();
    }
};



