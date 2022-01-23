const inquirer = require('inquirer');
const db = require('./config/connection');


const initChoices = [
  'View all departments',
  'View all roles',
  'View all employees',
  'Add a department',
  'Add a role',
  'Add an employee',
  'Update an employee'
];


function initWork() {
  inquirer
    .prompt(
      {
        type: 'list',
        name: 'selection',
        message: 'Select something',
        choices: initChoices
      }
    )
    .then(({selection}) => {
      if(selection === initChoices[0]){ //View departments
        const sql = 
        `
        SELECT 
        name AS Department
        FROM department
        `
        db.query(sql, (err, departments) => {
          if(err) {
            console.log(err);
            return;
          }
          console.table(departments);
          console.log("\n");
          initWork();
        })
      } else if (selection === initChoices[1]) { //View roles
        const sql = 
        `
        SELECT
        role.title AS 'Job Title',
        role.salary AS Salary,
        department.name AS 'Department Name'
        FROM role
        LEFT JOIN department ON role.department_id = department.id;
        `

        db.query(sql, (err, roles) => {
          if(err) {
            console.log(err);
            return;
          }
          console.table(roles);
          console.log("\n");
          initWork();
        })
      } else if (selection === initChoices[2]){ //View employees
        const sql = 
        `
        SELECT 
        concat(employee.first_name, " ", employee.last_name) AS Name,
        employee.manager_id AS Manager,
        role.title as 'Job Title',
        role.salary as 'Salary',
        department.name as 'Department'
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON employee.role_id = department.id
        `

        db.query(sql, (err, employees) => {
          if(err) {
            console.log(err);
            return;
          }
          console.table(employees);
          console.log("\n");
          initWork();
        })
      } else if (selection === initChoices[3]){ //add new department
        addDepartment();
      } else if (selection === initChoices[4]){ //add new role
        addRole();
      } else if (selection === initChoices[5]){ //add new employee
        addEmployee();
      }
    })
    .catch((error) => {
      console.log(error);
    })
}


initWork();


const addDepartment = async () => {
  const deptData = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is the new department?"
    }
  ]);
  await db.promise().query('INSERT INTO department SET ?', deptData);
  initWork();
}

const addRole = async () => {
  const departments = await db.promise().query('SELECT * FROM department');
  const departmentMap = await departments[0].map(({id, name}) => ({
    name: name,
    value: id
  }));

  const userData = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is the new title of the role?'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary?'
    },
    {
      type: 'list',
      name: 'department_id',
      message: 'What department would you like to add the role to?',
      choices: departmentMap
    }
  ]);
  console.log("userData", userData);
  await db.promise().query('INSERT INTO role SET ?', userData);
  initWork();
}

const addEmployee = async () => {
  const managers = await db.promise().query(
    `
    SELECT 
    * 
    FROM employee
    `);
  const managersMap = await managers[0].map(({id, first_name, last_name, role_id, manager_id}) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }))
  const roles = await db.promise().query(
    `
    SELECT 
    * 
    FROM role
    `);
  const rolesMap = await roles[0].map(({id, title, salary, department_id}) => ({
    name: title,
    value: id
  }))
  const employeeData = await inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: "What's their first name?",
      validate: input => {
        if(input) {
          return true;
        } else {
          console.log("Please enter a first name.");
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'last_name',
      message: "What's their last name?",
      validate: input => {
        if(input) {
          return true;
        } else {
          console.log("Please enter a last name.");
          return false;
        }
      }
    },
    {
      type: 'list',
      name: 'role_id',
      message: "What's their role?",
      choices: rolesMap
    },
    {
      type: 'list',
      name: 'manager_id',
      message: "Who's their manager?",
      choices: managersMap
    }
  ]);
  console.log("employeeData", employeeData);
  await db.promise().query('INSERT INTO employee SET ?', employeeData);
  initWork();
}