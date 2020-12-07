const inquirer = require("inquirer");

const chooseEmployee = async function (employeeArr) {
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
      return { employee: employeeArr[idx], all: employeeArr };
    });
};
module.exports = chooseEmployee;
