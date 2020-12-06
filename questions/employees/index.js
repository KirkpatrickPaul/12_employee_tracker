const inquirer = require("inquirer");
const add = require("./add.js");
const changeRole = require("./changeRole.js")
const addManager = require("../addManager")

const employees = async function() {
  inquirer.prompt([{
  name: "employees",
  type: "list",
  message: "What would you like to do?",
  choices: [
    "See all employees",
    "Add an employee",
    "Change an employee's role",
    "Change an employee's manager",
  ],
}]).then(answer => {
  switch (answer) {
case "See all employees":
  }
})
}