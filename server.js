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
    // console.log(`Connected to the myBusiness_db database.`),
);

// add connection.db
db.connect(async (err) => {
    if (err) throw err;
    console.log(`Connected to the myBusiness_db database.`);
    init();
});



const questionMain = [
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
]

// main options on dashboard
const init = async () => {
    let questionRes = await inquirer.prompt(questionMain);
    option(questionRes.dashboard);
    console.log(questionRes.dashboard);
};

// different options in mainOptions
const option = async (response) => {
    if (response === 'View all departments') {
        viewDepartment();
    }
    else if (response === 'View all roles') {
        viewRole();
    }
    else if (response === 'View all employees') {
        viewEmployee(response);
        // console.log('all people');
    }
    else if (response === 'Add a department') {
        addDepartment();
    }
    else if (response === 'Add a role') {
        addRole();
    }
    else if (response === 'Add an employee') {
        addEmployee();
    }
    else if (response === 'Update an employee role') {
        updateEmRole();
    }
    else if (response === 'I am done') {
        console.log('Thanks for using Employee Tracker!')
        connection.end();
    }
};

// function to view table for all employees
function viewEmployee() {
    const query = `SELECT * FROM employee`;

    db.query(query, (err, employee) => {
        if (err) { console.log(err); }
        else {
            console.table(employee);
            init();
        }
    });
};


