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

// connect to MySQL database
db.connect(async (err) => {
    if (err) { console.log(err); }
    else {
        console.log(`Connected to the myBusiness_db database.`);
        init();
    }
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
    // console.log(questionRes.dashboard);
};

// different options in mainOptions
const option = async (response) => {
    if (response === 'View all departments') {
        viewDepartment(response);
    }
    else if (response === 'View all roles') {
        viewRole(response);
    }
    else if (response === 'View all employees') {
        viewEmployee(response);
    }
    else if (response === 'Add a department') {
        addDepartment(response);
    }
    else if (response === 'Add a role') {
        addRole(response);
    }
    else if (response === 'Add an employee') {
        addEmployee(response);
    }
    else if (response === 'Update an employee role') {
        updateEmRole(response);
    }
    else if (response === 'I am done') {
        console.log('Thanks for using Employee Tracker!')
        connection.end();
    }
};

// function to display table of all departments
function viewDepartment() {
    // Import query from Queries class;
    const query = new Queries();
    db.query(query.viewDepartment(), (err, department) => {
        if (err) { console.log(err); }
        else {
            console.table(department);
            init();
        }
    });
};

// function to display table of all roles
function viewRole() {
    // Import query from Queries class;
    const query = new Queries();
    db.query(query.viewRole(), (err, role) => {
        if (err) { console.log(err); }
        else {
            console.table(role);
            init();
        }
    });
};

// function to display table of all employees
function viewEmployee() {
    // Import query from Queries class;
    const query = new Queries();
    db.query(query.viewEmployee(), (err, employee) => {
        if (err) { console.log(err); }
        else {
            console.table(employee);
            init();
        }
    });
};

function addDepartment() {
    const query = new Queries();
    inquirer
        .prompt([
            {
                name: "name",
                type: 'input',
                message: "What department do you want to add?"
            }
        ])
        .then(response => {
            db.query(query.addDepartment(), response.name);
            console.log(`New department added: ${response.name}`);
            init();
        })
        .catch((err) => {
            console.error(err);
            db.end();
        });
}

function addRole() {
    const query = new Queries();
    inquirer
        .prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is the new role?',
            },
            {
                name: 'salary',
                type: 'number',
                message: 'What is the salary of the new role?',
            },
            {
                name: 'department',
                type: 'list',
                message: 'Which department does the new role fit?',
                choices: [
                    { name: 'Management', value: 1 },
                    { name: 'Engineer', value: 2 },
                    { name: 'Design', value: 3 },
                    { name: 'Finance', value: 4 }
                ]
            },
        ])
        .then(response => {
            db.query(
                query.addRole(),
                { 'title': response.title, 'salary': response.salary, 'department_id': response.department }
            );
            console.log(`New role added: ${response.title}`);
            init();
        })
        .catch((err) => {
            console.error(err);
            db.end();
        });
}

function addEmployee() {
    const query = new Queries();
    inquirer
        .prompt([
            {
                name: 'first',
                type: 'input',
                message: "What is the new employee's first name?",
            },
            {
                name: 'last',
                type: 'input',
                message: "What is the new employee's last name?",
            },
            // value number to match role id
            {
                name: 'role',
                type: 'list',
                message: "What is the new employee's role?",
                choices: [
                    { name: 'Principal', value: 1 },
                    { name: 'Project Manager', value: 2 },
                    { name: 'Software Engineer', value: 3 },
                    { name: 'UX Designer', value: 4 },
                    { name: 'UI Designer', value: 5 },
                    { name: 'Accountant', value: 6 },
                ]
            },
            // value number to match manager id
            {
                name: 'manager',
                type: 'list',
                message: 'Who is the employees manager?',
                choices: [
                    { name: 'John Doe', value: 1 },
                    { name: 'Mike Brown', value: 2 },
                    { name: 'Andrew Peters', value: 3 },
                ]
            }
        ])
        .then(response => {
            db.query(
                query.addEmployee(),
                [response.first, response.last, response.role, response.manager]
            );
            console.log(`New employee added: ${response.first} ${response.last}`);
            init();
        })
        .catch((err) => {
            console.error(err);
            db.end();
        });
}

function updateEmRole() {
    db.query("SELECT first_name from employee", (err, result) => {
        if (err) throw err;
        console.log(result.map(({ first_name }) => first_name));
    })
}
