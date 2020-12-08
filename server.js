const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_db",
});
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id" + connection.threadId);
  questions();
});

function capFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

const allEmployees = function (cb, data = "") {
  connection.query(
    "SELECT * FROM employees LEFT OUTER JOIN roles ON employees.role_id = roles.id;",
    (err, res) => {
      if (err) throw err;
      const prettified = res.map((emp) => {
        const nameF = capFirstLetter(emp.first_name);
        const nameL = capFirstLetter(emp.last_name);
        let empManager = { first_name: "no", last_name: "manager" };
        if (emp.manager_id) {
          empManager = res.find((employee) => employee.id === emp.manager_id);
        }
        const managerNameF = capFirstLetter(empManager.first_name);
        const managerNameL = capFirstLetter(empManager.last_name);
        const obj = {
          id: emp.id,
          name: nameF + " " + nameL,
          first_name: nameF,
          last_name: nameL,
          manager: managerNameF + " " + managerNameL,
          manager_id: emp.manager_id,
          role_id: emp.title,
        };
        return obj;
      });
      if (data) {
        cb(prettified, data);
      } else {
        cb(prettified);
        questions();
      }
    }
  );
};

const allRoles = function (cb, data = "") {
  connection.query(
    `SELECT * FROM roles AS rol
  LEFT OUTER JOIN departments AS dept 
  ON rol.department_id = dept.id 
  LEFT OUTER JOIN
  (SELECT emp.id, emp.first_name, emp.last_name FROM employees AS emp
  INNER JOIN departments AS dep
  ON dep.manager_id = emp.id) AS man
  ON man.id = dept.manager_id;`,
    function (err, res) {
      if (err) {
        throw err;
      }
      const prettified = res.map((rol) => {
        const nameF = capFirstLetter(rol.first_name);
        const nameL = capFirstLetter(rol.last_name);
        return {
          role: rol.title,
          department: rol.name,
          manager: nameF + " " + nameL,
          manager_id: rol.manager_id,
          department: rol.name,
          department_id: rol.department_id,
        };
      });
      if (data) {
        cb(prettified, data);
      } else {
        cb(prettified);
      }
    }
  );
};

const modifyEmployee = function (employee) {
  connection.query(
    `UPDATE employees SET 
  first_name = ?
  , last_name = ?
  , role_id = ?
  , manager_id = ?
  WHERE ?`,
    [
      employee.first_name,
      employee.last_name,
      employee.role_id,
      employee.manager_id,
      employee.id,
    ],
    function (err, data) {
      if (err) {
        throw err;
      }
    }
  );
};

const end = function () {
  connection.end();
  console.log("Thank you, have a nice day!");
};

const questions = function () {
  inquirer
    .prompt([
      {
        name: "whatDo",
        type: "list",
        message: "What would you like to look at and/or modify?",
        choices: ["Employees", "Roles", "Departments", "Nothing, I'm finished"],
      },
    ])
    .then(function (ans) {
      switch (ans.whatDo) {
        case "Employees":
          employees();
          break;
        case "Roles":
          roles();
          break;
        case "Departments":
          departments();
          break;
        default:
          end();
      }
    });
};

const chooseEmployee = function (employeeArr, cb) {
  const employees = employeeArr.map((elem) => elem.name);
  inquirer
    .prompt([
      {
        name: "employee",
        type: "rawlist",
        message: "Which employee's information do you wish to modify?",
        choices: employees,
      },
    ])
    .then(function (answer) {
      const idx = employeeArr.findIndex(
        (elem) => elem.name === answer.employee
      );
      cb({ employee: employeeArr[idx], all: employeeArr });
    });
};

const newEmployee = async function (rolesArr) {
  const roles = rolesArr.map((obj) => obj.role);
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the new employee's FIRST name?",
      },
      {
        name: "last_name",
        type: "input",
        message: "What is the new employee's LAST name?",
      },
      {
        name: "role",
        type: "rawlist",
        message: "What role will the new employee serve in the company?",
        choices: roles,
      },
    ])
    .then((ans) => {
      allEmployees(function (employeesArr, data) {
        const employees = employeesArr.map((elem) => elem.name);
        const defaultManager = rolesArr.find((role) => data.role === role.role);
        inquirer
          .prompt([
            {
              name: "manager",
              type: "list",
              message: "Who will be the employee's manager?",
              choices: employees,
              default: defaultManager.manager,
            },
          ])
          .then((answers) => {
            const managerID = employeesArr.find(
              (employee) => employee.name === answers.manager
            );
            const roleID = rolesArr.find((rol) => rol.role === ans.role);
            connection.query(
              "INSERT INTO employees SET ?",
              {
                first_name: data.first_name,
                last_name: data.last_name,
                role_id: roleID.id,
                manager_id: managerID.id,
              },
              (err, _) => {
                if (err) {
                  throw err;
                }
              }
            );
            questions();
          });
      }, ans);
    });
};

// rolesArr should be an array filled with objects that have {id: x, role: y, manager: z} format.
// employeesArr should be an array filled with objects that have {id: w, name: x, manager: y, role_id: z} format.
const addManager = function (
  rolesArr,
  employeesArr,
  role = "", // should be the recommended role's id number if applicable
  previousAnswers = "" //for passing information to modifyEmployee
) {
  let roleIdx = 0;
  if (role) {
    roleIdx = rolesArr.findIndex((elem) => elem.role === role);
  }
  const roleManager = rolesArr[roleIdx].manager;
  const employees = employeesArr.map((elem) => elem.name);
  const roleID = rolesArr[roleIdx].id;

  inquirer
    .prompt([
      {
        name: "manager",
        type: "list",
        message: "Who will be the employee's manager?",
        choices: employees,
        default: roleManager,
      },
    ])
    .then((answers) => {
      const idx = employees.findIndex((emp) => emp === answers.manager);
      const manager = employeesArr[idx];
      if (previousAnswers) {
        previousAnswers.employee.manager_id = manager.id;
        previousAnswers.employee.manager = manager.manager;
        previousAnswers.employee.role_id = roleID;
        return previousAnswers;
      } else {
        return manager;
      }
    });
};

const employees = function () {
  inquirer
    .prompt([
      {
        name: "employees",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "See all employees",
          "Add an employee",
          "Change an employee's role",
          "Change an employee's manager",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.employees) {
        case "See all employees":
          allEmployees(console.table);
          break;
        case "Add an employee":
          allRoles(newEmployee);
          break;
        case "Change an employee's role":
          allEmployees(chooseEmployee, changeRole);
          break;
        case "Change an employee's manager":
          chooseEmployee(allEmployees()).then((ans) => {
            modifyEmployee(
              addManager(allRoles(), ans.all, ans.employee.role, ans.employee)
            );
          });
          questions();
          break;
        default:
          questions();
      }
    });
};

const changeRole = function (empObj) {
  allRoles(changeRoleCB, empObj);
  const changeRoleCB = (rolesArr, emps) => {
    const roles = rolesArr.map((roleObj) => roleObj.role);
    const employees = emps.all.map((employee) => employee.name);
    inquirer
      .prompt([
        {
          name: "role",
          type: "rawlist",
          message: "What new role will the employee serve in the company?",
          choices: roles,
        },
        {
          name: "changeManager",
          type: "confirm",
          message: "Change employees manager as well?",
        },
        {
          name: "manager",
          type: "rawlist",
          message: "Who should be the employee's new manager?",
          choices: employees,
          when: (answers) => answers.confirm,
        },
      ])
      .then((ans) => {
        const employee = empObj.employee;
        roleObj = rolesArr.find((role) => role.role === ans.role);
        employee.role_id = roleObj.role_id;
        if (ans.manager) {
          const newManager = empObj.all.find((emp) => emp.name === ans.manager);
          employee.manager_id = newManager.id;
        }
      });
  };
};
