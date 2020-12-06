const inquirer = require("inquirer");
const add = require("./add");
const modifyEmployee = require("./modifyEmployee");
const chooseEmployee = require("./chooseEmployee");
const addManager = require("../addManager");
const db = require("../../db_queries");
const questions = require("../index");

const employees = async function () {
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
      switch (answer) {
        case "See all employees":
          console.table(db.allEmployees());
          questions();
          break;
        case "Add an employee":
          add();
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
                ans.employee.role_id,
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
module.exports = employees;
