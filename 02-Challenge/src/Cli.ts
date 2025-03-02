import inquirer from "inquirer";
import { query } from "./db";
import process from "process";


async function mainMenu() {
    const answers = await inquirer.prompt([
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
        await viewDepartments();
        break;
      case "View all roles":
        await viewRoles();
        break;
      case "View all employees":
        await viewEmployees();
        break;
      case "Add a department":
        await addDepartment();
        break;
      case "Add a role":
        await addRole();
        break;
      case "Add an employee":
        await addEmployee();
        break;
      case "Update an employee's role":
        await updateEmployeeRole();
        break;
      case "Exit":
        console.log("Goodbye!");
        process.exit();
    }
  
    mainMenu();
  }
  

async function viewDepartments() {
  const res = await query("SELECT * FROM department;");
  console.table(res.rows);
}

async function viewRoles() {
  const res = await query("SELECT * FROM roles;");
  console.table(res.rows);
}

async function viewEmployees() {
  const res = await query("SELECT * FROM employee;");
  console.table(res.rows);
}

async function addDepartment() {
    const answer = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the new department:",
      },
    ]);
  
    await query("INSERT INTO department (name) VALUES ($1);", [answer.name]);
    console.log(`Department '${answer.name}' added successfully.`);
  }
  
  async function addRole() {
    const departments = await query("SELECT * FROM department;");
    const departmentChoices = departments.rows.map((dept: any) => ({
      name: dept.name,
      value: dept.id,
    }));
  
    const answers = await inquirer.prompt([
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
  
    await query(
      "INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3);",
      [answers.title, answers.salary, answers.department_id]
    );
  
    console.log(`Role '${answers.title}' added successfully.`);
  }
  
  async function addEmployee() {
    const roles = await query("SELECT * FROM roles;");
    const roleChoices = roles.rows.map((role: any) => ({
      name: role.title,
      value: role.id,
    }));
  
    const employees = await query("SELECT * FROM employee;");
    const managerChoices = employees.rows.map((emp: any) => ({
      name: `${emp.first_name} ${emp.last_name}`,
      value: emp.id,
    }));
  
    managerChoices.unshift({ name: "None", value: null });
  
    const answers = await inquirer.prompt([
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
  
    await query(
      "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);",
      [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]
    );
  
    console.log(`Employee '${answers.first_name} ${answers.last_name}' added successfully.`);
  }
  
  async function updateEmployeeRole() {
    const employees = await query("SELECT * FROM employee;");
    const employeeChoices = employees.rows.map((emp: any) => ({
      name: `${emp.first_name} ${emp.last_name}`,
      value: emp.id,
    }));
  
    const roles = await query("SELECT * FROM roles;");
    const roleChoices = roles.rows.map((role: any) => ({
      name: role.title,
      value: role.id,
    }));
  
    const answers = await inquirer.prompt([
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
  
    await query("UPDATE employees SET role_id = $1 WHERE id = $2;", [
      answers.role_id,
      answers.employee_id,
    ]);
  
    console.log(`Employee's role updated successfully.`);
  }
  

mainMenu();


