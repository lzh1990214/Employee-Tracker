class Queries {

    viewEmployee() {
        return `SELECT * FROM employee`;
    }

    viewRole() {
        return `SELECT * FROM role`;
    }

    viewDepartment() {
        return `SELECT * FROM department`;
    }

    addEmployee() {
        return `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)`;
    }

    addRole() {
        return `INSERT INTO role SET ?`;
    }

    addDepartment() {
        return `INSERT INTO department(name) VALUES(?)`;
    }

    updateEmpRole() {
        return `UPDATE employee SET role_id =? WHERE last_name =?`;
    }
}

module.exports = Queries;