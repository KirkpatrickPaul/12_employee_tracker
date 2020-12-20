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

const allEmployees = function (cb, ...data) {
  connection.query(
    `SELECT emp.id AS id
    , emp.first_name AS first_name
    , emp.last_name AS last_name
    , emp.manager_id AS manager_id
    , emp.role_id AS role_id
    , rol.title AS role
     FROM employees AS emp
    LEFT OUTER JOIN roles AS rol 
    ON emp.role_id = rol.id;`,
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

        const obj = emp;
        obj.name = nameF + " " + nameL;
        obj.manager = managerNameF + " " + managerNameL;
        return obj;
      });
      const [firstArg] = data;
      if (firstArg) {
        cb(prettified, ...data);
      } else {
        console.log("else");
        cb(prettified);
        questions();
      }
    }
  );
};

const allDepartments = function (cb, ...data) {
  connection.query(
    `SELECT 
    d.id AS id,
    d.name AS department,
    d.manager_id AS manager_id,
    e.first_name AS manager_first_name,
    e.last_name AS manager_last_name
    FROM departments AS d
    LEFT OUTER JOIN employees AS e
    ON d.manager_id = e.id;`,
    (err, res) => {
      if (err) throw err;
      const prettified = res.map((dept) => {
        const nameF = capFirstLetter(dept.manager_first_name);
        const nameL = capFirstLetter(dept.manager_last_name);
        const deptObj = dept;
        deptObj.manager_name = nameF + " " + nameL;
        return deptObj;
      });
      const [firstArg] = data;
      if (firstArg) {
        return cb(prettified, ...data);
      } else {
        cb(prettified);
        questions();
      }
    }
  );
};

const allRoles = function (cb, ...data) {
  connection.query(
    `SELECT 
    rol.id AS id,
    rol.title AS role,
    rol.department_id AS department_id,
    dept.manager_id AS manager_id,
    dept.name AS department_name,
    man.first_name AS manager_first_name,
    man.last_name AS manager_last_name
    FROM roles AS rol
  LEFT OUTER JOIN departments AS dept 
  ON rol.department_id = dept.id 
  LEFT OUTER JOIN
  (SELECT emp.id, emp.first_name, emp.last_name FROM employees AS emp
  INNER JOIN departments AS dep
  ON dep.manager_id = emp.id) AS man
  ON man.id = dept.manager_id;`,
    function (err, res) {
      if (err) throw err;
      const prettified = res.map((rol) => {
        const newRole = rol;
        const nameF = capFirstLetter(rol.manager_first_name);
        const nameL = capFirstLetter(rol.manager_last_name);
        newRole.manager = nameF + " " + nameL;
        return newRole;
      });
      const [firstArg] = data;
      if (firstArg) {
        cb(prettified, ...data);
      } else {
        cb(prettified);
        questions();
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
  WHERE employees.id = ?`,
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
      console.log("Success! Employee's information has been changed.");
      questions();
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

const chooseEmployee = function (employeeArr, cb, ...data) {
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
      cb({ employee: employeeArr[idx], all: employeeArr }, ...data);
    });
};

const newEmployee = function (rolesArr, cb) {
  const roles = rolesArr.map((obj) => obj.role);
  let employeeArr = allEmployees((data, _) => (employeeArr = data), 1);
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
      const nameF = capFirstLetter(ans.first_name);
      const nameL = capFirstLetter(ans.last_name);
      const roleObj = rolesArr.find((role) => role.role === ans.role);
      const employeeObj = {
        all: employeeArr,
        employee: {
          name: nameF + " " + nameL,
          first_name: nameF,
          last_name: nameL,
          role: ans.role,
          role_id: roleObj.id,
        },
      };
      const newEmployeeCB = function (data) {
        connection.query(
          "INSERT INTO employees SET ?",
          {
            first_name: data.first_name,
            last_name: data.last_name,
            role_id: data.role_id,
            manager_id: data.manager_id,
          },
          (err, _) => {
            if (err) {
              throw err;
            }
          }
        );
        console.log("Success! New employee has been created.");
        cb();
      };
      addManager(rolesArr, employeeObj, newEmployeeCB, roleObj.role);
    });
};

const managerHandler = function (empObj, cb) {
  allRoles(addManager, empObj, cb);
};

const addManager = function (rolesArr, everyEmployee, cb = "", role = "") {
  let roleIdx = 0;
  if (role) {
    roleIdx = rolesArr.findIndex((elem) => elem.role === role);
  }
  let employeesArr = everyEmployee;
  if (everyEmployee.all) {
    employeesArr = everyEmployee.all;
  }
  const roleManager = rolesArr[roleIdx].manager;
  const employees = employeesArr.map((elem) => elem.name);
  const roleID = rolesArr[roleIdx].id;

  inquirer
    .prompt([
      {
        name: "manager",
        type: "list",
        message: "Who will be the new manager?",
        choices: employees,
        default: roleManager,
      },
    ])
    .then((answers) => {
      const newManager = employeesArr.find(
        (emp) => emp.name === answers.manager
      );
      if (everyEmployee.employee) {
        everyEmployee.employee.manager_id = newManager.id;
        everyEmployee.employee.manager = newManager.name;
        if (role || everyEmployee.employee.role_id) {
          everyEmployee.employee.role_id = roleID;
        }
        cb(everyEmployee.employee);
      } else if (role) {
        cb({ id: roleID, manager_id: newManager.id });
      } else {
        cb(newManager);
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
          allRoles(newEmployee, questions);
          break;
        case "Change an employee's role":
          allEmployees(chooseEmployee, changeRole);
          break;
        case "Change an employee's manager":
          allEmployees(chooseEmployee, managerHandler, modifyEmployee);
          break;
        default:
          end();
      }
    });
};

const changeRole = function (empObj) {
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
      ])
      .then((ans) => {
        roleObj = rolesArr.find((role) => role.role === ans.role);
        empObj.employee.role_id = roleObj.id;
        if (ans.changeManager) {
          addManager(rolesArr, empObj, modifyEmployee, roleObj.role);
        } else {
          modifyEmployee(empObj.employee);
        }
      });
  };
  allRoles(changeRoleCB, empObj);
};

const roles = function () {
  inquirer
    .prompt([
      {
        name: "roles",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "See all roles",
          "Change an employee's role",
          "Add a new role",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.roles) {
        case "See all roles":
          allRoles(console.table);
          break;
        case "Change an employee's role":
          allEmployees(chooseEmployee, changeRole);
          break;
        case "Add a new role":
          allDepartments(newRole, questions);
          break;
        default:
          end();
      }
    });
};

const newRole = function (deptArr, cb) {
  const departments = deptArr.map((dept) => dept.department);
  inquirer
    .prompt([
      {
        name: "newRole",
        type: "input",
        message: "What will the new role be called?",
      },
      {
        name: "department",
        type: "rawlist",
        message: "To which department will the new role belong?",
        choices: departments,
      },
    ])
    .then((ans) => {
      roleDept = deptArr.find((dept) => dept.department === ans.department);
      connection.query(
        "INSERT INTO roles SET ?",
        {
          title: ans.newRole,
          department_id: roleDept.id,
        },
        (err, _) => {
          if (err) {
            throw err;
          }
          console.log("Success! New Role has been added.");
          cb();
        }
      );
    });
};

const departments = function () {
  inquirer
    .prompt([
      {
        name: "employees",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "See all departments",
          "Add a department",
          "Add a role to a department",
          "Change a department's manager",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.employees) {
        case "See all departments":
          allDepartments(console.table);
          break;
        case "Add a department":
          allEmployees(newDepartment, allRoles);
          break;
        case "Add a role to a department":
          allDepartments(newRole, questions);
          break;
        case "Change a department's manager":
          allDepartments(chooseDepartment, questions);
          break;
        default:
          end();
      }
    });
};

const newDepartment = function (employeeArr, cb) {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "What is the new department called?",
      },
    ])
    .then((ans) => {
      const answerObj = ans;
      console.log("answerObj :>> ", answerObj);
      answerObj.ModifyDept = function (managerObj, cb) {
        connection.query(
          "INSERT INTO departments SET name = ?, manager_id = ?",
          [this.department, managerObj.id],
          (err, data) => {
            if (err) {
              throw err;
            }
            console.log("Success! New Department has been added.");
            questions();
          }
        );
      };
      const boundModify = answerObj.ModifyDept.bind(answerObj);
      cb(addManager, employeeArr, boundModify);
    });
};

const chooseDepartment = function (departmentArr, cb) {
  const departments = departmentArr.map((elem) => elem.department);
  inquirer
    .prompt([
      {
        name: "department",
        type: "rawlist",
        message: "Which department do you wish to modify?",
        choices: departments,
      },
    ])
    .then(function (ans) {
      const deptObj = departmentArr.find(
        (dept) => dept.department === ans.department
      );
      const updateDept = function (managerObj) {
        connection.query(
          `UPDATE departments SET 
        name = ?
        , manager_id = ?
      WHERE departments.id = ?`,
          [this.department, managerObj.id, this.id],
          function (err, data) {
            if (err) {
              throw err;
            }
            console.log("Success! Department's information has been changed.");
            questions();
          }
        );
      };
      const boundUpdateDept = updateDept.bind(deptObj);
      allEmployees(managerHandler, boundUpdateDept);
    });
};
