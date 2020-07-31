const connection= require ("./connection");

class DB {

constructor (connection) {

    this.connection=connection;

}

findAllEmployees() {
    return this.connection.query("Select employee.id, employee.first_name, employee.last_name")

}

findAllEmployeesByDepartment (departmentID) {

    return this.connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id=role.id LEFT JOIN department department on role.department_id=department.id WHERE department.id=?;",departmentID)
    
}




}

module.exports = new DB (connection)