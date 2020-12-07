const inquirer = require("inquirer");

const newEmployee = async function(rolesArr) {
const roles = rolesArr.map(obj => obj.role)
inquirer.prompt([
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
};
module.exports = newEmployee