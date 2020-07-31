const {
    prompt
} = require("inquirer");
const db = require("./db");
const inquirer = require("inquirer");
const {
    listenerCount
} = require("process");
require("console.table");
// const logo = require("asciiart-logo");

async function mainPrompts() {

    const {
        choice
    } = await prompt([
        //View emp by manager, add employee, remove employee, update emp role, update emp manager
        // view all roles, add role, remove role, view all departments, add department, remove department, qit
        {
            type: "list",
            name: "task",
            message: "Would you like to do?",
            choices: [{
                    name: "View All Employees",
                    value: "VIEW_EMPLOYEES",
                },
                {
                    name: "View all Employees Department",
                    value: "VIEW_EMPLOYEES_BY_DEPARTMENT",
                },

                {
                    name: "Add department",
                    value: "ADD_DEPARTMENT",
                },

                {
                    name: "Add employees",
                    value: "ADD_EMPLOYEES",
                },

                {
                    name: "Add roles",
                    value: "ADD_ROLES",
                },

                {
                    name: "View roles",
                    value: "VIEW_ROLES",
                },

                {
                    name: "quit",
                    value: "QUIT",
                },

            ]

        }
    ])

    switch (choice) {

        case "VIEW_EMPLOYEES":
            return viewEmployees();

        case "VIEW_EMPLOYEES_BY_DEPARTMENT":
            return viewEmployeesByDepartment();


        case "ADD_EMPLOYEES":
            return addEmployees();


        case "ADD_DEPARTMENT":
            return addDepartment();


        case "ADD_ROLES":
            return addRoles();


        case "VIEW_ROLES":
            return viewRoles();


        default:
            quit();

    }

    async function viewEmployees() {

        const employees = await db.findAllEmployees();
        console.log("\n");
        console.table(employees);

        mainPrompts();

    }

    async function viewEmployeesByDepartment() {

        const departments = await db.findAllDepartments();
        const choices = departments.map(({
            id,
            name
        }) => ({
            name: name,
            value: id,
        }))
        const {
            departmentID
        } = await prompt([{
            type: "list",
            name: "departmentID",
            message: "Which department would you like to see employees for",
            choices: choices,
        }])
        const employees = await db.findAllEmployeesByDepartment(departmentID)

        console.log("\n");
        console.table(employees);

        mainPrompts();

    }   

    async function addEmployees() {
        const roles = await db.findAllRoles()
        const employees = await db.findAllEmployees()
        const employee = await prompt([{
                name: "first_name",
                message: "What is the employees first name?",

            },

            {
                name: "last_name",
                message: "What is the employees last name?",
            }

        ])

        const roleChoices = roles.map(({
            id,
            title
        }) => ({
            name: title,
            value: id
        }))
        const {
            roleID
        } = await prompt({
            type: "list",
            name: "roleID",
            message: "What is your role?",
            choices: roleChoices
        })
        employee.role_ID = roleID

        const managerChoices = employees.map(({
            id,
            first_name,
            last_name
        }) => ({

            name: `${first_name} ${last_name}`,
            value: id
        }));

        managerChoices.unshift({ name: "None", value: null});

        const { managerId } =await prompt ({

            type: "list",
            name: "managerId",
            message: "Who is the employee's manager?",
            choices: managerChoices

        });

        employee.manager_id=managerId;

        await db.createEmployee(employee);

        console.log(
            `Added ${employee.first_name} ${employee.last_name} to the database`
        );

        loadMainPrompts();



    }

    function quit() {

        console.log("Quitting Program");
        process.exit()
    }









}