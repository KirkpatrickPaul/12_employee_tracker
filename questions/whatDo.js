const inquirer = require("inquirer");

const whatDo = async function () {
  inquirer.prompt([
    {
      name: "whatDo",
      type: "list",
      message: "What would you like to look at and/or modify?",
      choices: ["Employees", "Roles", "Departments", "Nothing, I'm finished"],
    },
  ]);
};
module.exports = whatDo;
