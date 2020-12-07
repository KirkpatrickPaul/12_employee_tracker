const inquirer = require("inquirer");
const newEmployee = require("./newEmployee");
const chooseEmployee = require("./chooseEmployee");
const addManager = require("../addManager");
const db = require("../../server.js");
const questions = require("../index");

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
          db.allEmployees(true);
          questions();
          break;
        case "Add an employee":
          const rolesArr = db.allRoles()();
          db.addEmployee(
            newEmployee(rolesArr).then((ans) =>
              addManager(rolesArr, db.allEmployees(), ans.role, {
                employee: ans,
              })
            )
          );
          questions();
          break;
        case "Change an employee's role":
          chooseEmployee(db.allEmployees()).then((ans) => {
            db.modifyEmployee(ans.employee);
          });
          questions();
          break;
        case "Change an employee's manager":
          chooseEmployee(db.allEmployees()).then((ans) => {
            db.modifyEmployee(
              addManager(
                db.allRoles(),
                ans.all,
                ans.employee.role,
                ans.employee
              )
            );
          });
          questions();
          break;
        default:
          questions();
      }
    });
};

