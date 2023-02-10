// import dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');
const Queries = require('./lib/query');

// create connection to MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'myBusiness_db',
},);

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
            'Remove an employee',
            'I am done'
        ],
    }
]

// prompt main options on dashboard
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
    else if (response === 'Remove an employee') {
        deleteEmp(response);
    }
    else if (response === 'I am done') {
        console.log('Thanks for using Employee Tracker!')
        db.end();
    }
};

// function to display table of all departments
function viewDepartment() {
    // import query from Queries class;
    const query = new Queries();
    // upgrade an existing non-Promise connection to use Promises by '.promise()' from MySQL2
    db.promise().query(query.viewDepartment())
        .then(response => {
            console.table(response[0]);
            init();
        })
        .catch((err) => {
            console.error(err);
            db.end();
        });
};

// function to display table of all roles
function viewRole() {
    // Import query from Queries class;
    const query = new Queries();
    db.promise().query(query.viewRole())
        .then(response => {
            console.table(response[0]);
            init();
        })
        .catch((err) => {
            console.error(err);
            db.end();
        });
};

// function to display table of all employees
function viewEmployee() {
    // Import query from Queries class;
    const query = new Queries();
    db.promise().query(query.viewEmployee())
        .then(response => {
            console.table(response[0]);
            init();
        })
        .catch((err) => {
            console.error(err);
            db.end();
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
    db.promise().query(query.viewDepartment())
        .then(([rows]) => {
            let departments = rows;
            // reformat the objects in the array with map() method to set the value as the id number
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id,
            }));
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
                        choices: departmentChoices,
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
        })
        .catch((err) => {
            console.error(err);
            db.end();
        });
}

function addEmployee() {
    const query = new Queries();
    db.promise().query(query.viewRole())
        .then(([rows]) => {
            let roles = rows;
            const roleChoices = roles.map(({ id, title }) => ({
                name: title,
                value: id,
            }));
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
                    {
                        name: 'role',
                        type: 'list',
                        message: "What is the new employee's role?",
                        choices: roleChoices,
                    }
                ])
                .then(response => {
                    let first = response.first;
                    let last = response.last;
                    let role = response.role;
                    db.promise().query(query.viewEmployee())
                        .then(([rows]) => {
                            // console.log(rows);
                            let employees = rows;
                            // map the objects in the array to set the value as the id number
                            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                                name: first_name + ' ' + last_name,
                                value: id,
                            }));
                            inquirer
                                .prompt([
                                    {
                                        name: 'manager',
                                        type: 'list',
                                        message: "Who is the employee's manager?",
                                        choices: employeeChoices,
                                    }
                                ])
                                .then(response => {
                                    let managerName = employeeChoices[parseInt(response.manager)].name;
                                    db.query(
                                        query.addEmployee(),
                                        [first, last, role, response.manager]
                                    );
                                    console.log(`New employee added: ${first} ${last} and the manager is ${managerName}`);
                                    init();
                                })
                        })
                        .catch((err) => {
                            console.error(err);
                            db.end();
                        });
                })
                .catch((err) => {
                    console.error(err);
                    db.end();
                });
        })
}

function updateEmRole() {
    const query = new Queries();
    db.promise().query(query.viewEmployee())
        .then(([rows]) => {
            // console.log(rows);
            let employees = rows;
            // map the objects in the array to set the value as the id number
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: first_name + ' ' + last_name,
                value: id,
            }));
            inquirer
                .prompt([
                    {
                        name: 'employee',
                        type: 'list',
                        message: "Who do you want to change the role for?",
                        choices: employeeChoices,
                    },
                ])
                .then(response => {
                    // console.log(response.employee);
                    // save selected employee id as a variable
                    let employeeID = response.employee;
                    // extract selected employee name from the employee choices list
                    let employeeName = employeeChoices[parseInt(employeeID) - 1].name;
                    // console.log(employeeName);
                    db.promise().query(query.viewRole())
                        .then(([rows]) => {
                            // console.log(rows);
                            let roles = rows;
                            // map the objects in the array to set the value as the id number
                            const roleChoices = roles.map(({ id, title }) => ({
                                name: title,
                                value: id,
                            }));
                            inquirer
                                .prompt([
                                    {
                                        name: 'role',
                                        type: 'list',
                                        message: "What is this employee's new role?",
                                        choices: roleChoices,
                                    }
                                ])
                                .then(response => {
                                    let roleID = response.role;
                                    let roleName = roleChoices[parseInt(roleID) - 1].name;
                                    // console.log(employeeID);
                                    // console.log(roleID);
                                    db.query(query.updateEmpRole(), [parseInt(roleID), employeeID], (err, res) => {
                                        if (err) throw err;
                                        console.log(`The role of ${employeeName} has been updated to: ${roleName}`);
                                        init();
                                    })
                                })
                                .catch((err) => {
                                    console.error(err);
                                    db.end();
                                });
                        })
                })
        })
        .catch((err) => {
            console.error(err);
            db.end();
        });
}

function deleteEmp() {
    const query = new Queries();
    db.promise().query(query.viewEmployee())
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: first_name + ' ' + last_name,
                value: id,
            }));
            inquirer
                .prompt([
                    {
                        name: 'employee',
                        type: 'list',
                        message: "Which employee do you want to remove?",
                        choices: employeeChoices,
                    },
                ])
                .then(response => {
                    let empID = response.employee;
                    // console.log(empID);
                    let empName = employeeChoices[parseInt(empID) - 1];
                    // console.log(empName.name);
                    db.query(query.deleteEmployee(), [parseInt(empID)], (err, res) => {
                        if (err) throw err;
                        console.log(`Employee ${empName.name} has been removed from my office.`);
                        init();
                    })
                })
                .catch((err) => {
                    console.error(err);
                    db.end();
                });
        })
        .catch((err) => {
            console.error(err);
            db.end();
        });
}
