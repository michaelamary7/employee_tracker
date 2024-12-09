"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const express_1 = __importDefault(require("express")); // Import the express module
const connections_1 = require("../dist/connections"); // Import the query function from connections.js
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware to parse JSON request bodies
app.use(express_1.default.json());
// Function to start the application
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    const options = [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
    ];
    const { option } = yield inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'Select an option:',
            choices: options,
        },
    ]);
    switch (option) {
        case 'View all departments':
            yield viewDepartments();
            break;
        case 'View all roles':
            yield viewRoles();
            break;
        case 'View all employees':
            yield viewEmployees();
            break;
        case 'Add a department':
            yield addDepartment();
            break;
        case 'Add a role':
            yield addRole();
            break;
        case 'Add an employee':
            yield addEmployee();
            break;
        case 'Update an employee role':
            yield updateEmployeeRole();
            break;
        case 'Exit':
            console.log('Exiting application...');
            process.exit();
    }
    // Restart the app after handling the selected option
    startApp();
});
// Function to view all departments
const viewDepartments = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield (0, connections_1.query)('SELECT * FROM departments;');
    console.table(res.rows);
});
// Function to view all roles
const viewRoles = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield (0, connections_1.query)('SELECT * FROM roles;');
    console.log(res.rows); // Log the result to check the data
    if (res.rows.length > 0) {
        console.table(res.rows);
    }
    else {
        console.log('No roles found.');
    }
});
// Function to view all employees
const viewEmployees = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield (0, connections_1.query)('SELECT * FROM employees;');
    console.log(res.rows); // Log the result to check the data
    if (res.rows.length > 0) {
        console.table(res.rows);
    }
    else {
        console.log('No employees found.');
    }
});
// Function to add a department
const addDepartment = () => __awaiter(void 0, void 0, void 0, function* () {
    const { departmentName } = yield inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter the name of the department:',
        },
    ]);
    yield (0, connections_1.query)('INSERT INTO departments (name) VALUES ($1);', [departmentName]);
    console.log(`Department ${departmentName} added successfully.`);
});
// Function to add a role
const addRole = () => __awaiter(void 0, void 0, void 0, function* () {
    const { roleName, salary, departmentId } = yield inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'Enter the name of the role:',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for this role:',
        },
        {
            type: 'input',
            name: 'departmentId',
            message: 'Enter the department ID for this role:',
        },
    ]);
    yield (0, connections_1.query)('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3);', [roleName, salary, departmentId]);
    console.log(`Role ${roleName} added successfully.`);
});
// Function to add an employee
// Function to add an employee
const addEmployee = () => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch existing roles to display
    const roles = yield (0, connections_1.query)('SELECT id, title FROM roles;');
    const roleChoices = roles.rows.map(role => ({
        name: role.title,
        value: role.id // Set value to role.id for use in inserts
    }));
    const { firstName, lastName, roleId, managerId } = yield inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter the employee\'s first name:',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter the employee\'s last name:',
        },
        {
            type: 'list',
            name: 'roleId', // Changed to 'list' to show valid roles
            message: 'Select the role for this employee:',
            choices: roleChoices, // Use the fetched roles here
        },
        {
            type: 'input',
            name: 'managerId',
            message: 'Enter the manager ID for this employee (leave blank if none):',
        },
    ]);
    yield (0, connections_1.query)('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);', [firstName, lastName, roleId, managerId || null]);
    console.log(`Employee ${firstName} ${lastName} added successfully.`);
});
// Function to update an employee's role
// Function to update an employee's role
const updateEmployeeRole = () => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch existing employees and roles
    const employees = yield (0, connections_1.query)('SELECT id, first_name, last_name FROM employees;');
    const roles = yield (0, connections_1.query)('SELECT id, title FROM roles;');
    // Create choices for employees
    const employeeChoices = employees.rows.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id // Set value to employee.id for use in updates
    }));
    // Create choices for roles
    const roleChoices = roles.rows.map(role => ({
        name: role.title,
        value: role.id // Set value to role.id for use in updates
    }));
    // Prompt for employee and new role
    const { employeeId, newRoleId } = yield inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee to update:',
            choices: employeeChoices,
        },
        {
            type: 'list',
            name: 'newRoleId', // Changed to 'list' to show valid roles
            message: 'Select the new role for this employee:',
            choices: roleChoices, // Use the fetched roles here
        },
    ]);
    yield (0, connections_1.query)('UPDATE employees SET role_id = $1 WHERE id = $2;', [newRoleId, employeeId]);
    console.log(`Employee ID ${employeeId} updated to role ID ${newRoleId} successfully.`);
});
// Start the application
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startApp(); // Start the inquirer prompt
});
