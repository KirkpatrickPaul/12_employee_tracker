const inquirer = require("inquirer");
const add = require("./add.js");
const changeRole = require("./changeRole.js")

const employees = {
  name: "employees",
  type: "list",
  message: "What would you like to do?",
  choices: [
    "See all employees",
    "Add an employee",
    "Change an employee's role",
    "Change an employee's manager",
  ],
  add: add,
  changeManager: changeManager,
  changeRole: changeRole,
}