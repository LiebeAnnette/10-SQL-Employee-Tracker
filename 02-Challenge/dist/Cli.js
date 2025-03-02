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
const db_1 = require("./db");
const process_1 = __importDefault(require("process"));
function mainMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        const answers = yield inquirer_1.default.prompt([
            {
                type: "list",
                name: "action",
                message: "What would you like to do?",
                choices: [
                    "View all departments",
                    "View all roles",
                    "View all employees",
                    "Add a department",
                    "Add a role",
                    "Add an employee",
                    "Update an employee's role",
                    "Exit",
                ],
            },
        ]);
        switch (answers.action) {
            case "View all departments":
                yield viewDepartments();
                break;
            case "View all roles":
                yield viewRoles();
                break;
            case "View all employees":
                yield viewEmployees();
                break;
            case "Add a department":
                yield addDepartment();
                break;
            case "Add a role":
                yield addRole();
                break;
            case "Add an employee":
                yield addEmployee();
                break;
            case "Update an employee's role":
                yield updateEmployeeRole();
                break;
            case "Exit":
                console.log("Goodbye!");
                process_1.default.exit();
        }
        mainMenu(); // Loop back to menu
    });
}
function viewDepartments() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield (0, db_1.query)("SELECT * FROM departments;");
        console.table(res.rows);
    });
}
function viewRoles() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield (0, db_1.query)("SELECT * FROM roles;");
        console.table(res.rows);
    });
}
function viewEmployees() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield (0, db_1.query)("SELECT * FROM employees;");
        console.table(res.rows);
    });
}
function addDepartment() {
    return __awaiter(this, void 0, void 0, function* () {
        const answer = yield inquirer_1.default.prompt([
            {
                type: "input",
                name: "name",
                message: "Enter the name of the new department:",
            },
        ]);
        yield (0, db_1.query)("INSERT INTO departments (name) VALUES ($1);", [answer.name]);
        console.log(`Department '${answer.name}' added successfully.`);
    });
}
function addRole() {
    return __awaiter(this, void 0, void 0, function* () {
        const departments = yield (0, db_1.query)("SELECT * FROM departments;");
        const departmentChoices = departments.rows.map((dept) => ({
            name: dept.name,
            value: dept.id,
        }));
        const answers = yield inquirer_1.default.prompt([
            {
                type: "input",
                name: "title",
                message: "Enter the name of the role:",
            },
            {
                type: "input",
                name: "salary",
                message: "Enter the salary for this role:",
            },
            {
                type: "list",
                name: "department_id",
                message: "Select the department:",
                choices: departmentChoices,
            },
        ]);
        yield (0, db_1.query)("INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3);", [answers.title, answers.salary, answers.department_id]);
        console.log(`Role '${answers.title}' added successfully.`);
    });
}
function addEmployee() {
    return __awaiter(this, void 0, void 0, function* () {
        const roles = yield (0, db_1.query)("SELECT * FROM roles;");
        const roleChoices = roles.rows.map((role) => ({
            name: role.title,
            value: role.id,
        }));
        const employees = yield (0, db_1.query)("SELECT * FROM employees;");
        const managerChoices = employees.rows.map((emp) => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id,
        }));
        managerChoices.unshift({ name: "None", value: null });
        const answers = yield inquirer_1.default.prompt([
            {
                type: "input",
                name: "first_name",
                message: "Enter the employee's first name:",
            },
            {
                type: "input",
                name: "last_name",
                message: "Enter the employee's last name:",
            },
            {
                type: "list",
                name: "role_id",
                message: "Select the employee's role:",
                choices: roleChoices,
            },
            {
                type: "list",
                name: "manager_id",
                message: "Select the employee's manager (if any):",
                choices: managerChoices,
            },
        ]);
        yield (0, db_1.query)("INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);", [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]);
        console.log(`Employee '${answers.first_name} ${answers.last_name}' added successfully.`);
    });
}
function updateEmployeeRole() {
    return __awaiter(this, void 0, void 0, function* () {
        const employees = yield (0, db_1.query)("SELECT * FROM employees;");
        const employeeChoices = employees.rows.map((emp) => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id,
        }));
        const roles = yield (0, db_1.query)("SELECT * FROM roles;");
        const roleChoices = roles.rows.map((role) => ({
            name: role.title,
            value: role.id,
        }));
        const answers = yield inquirer_1.default.prompt([
            {
                type: "list",
                name: "employee_id",
                message: "Select the employee to update:",
                choices: employeeChoices,
            },
            {
                type: "list",
                name: "role_id",
                message: "Select the new role:",
                choices: roleChoices,
            },
        ]);
        yield (0, db_1.query)("UPDATE employees SET role_id = $1 WHERE id = $2;", [
            answers.role_id,
            answers.employee_id,
        ]);
        console.log(`Employee's role updated successfully.`);
    });
}
mainMenu();
