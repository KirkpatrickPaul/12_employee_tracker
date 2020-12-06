const inquirer = require("inquirer");

// rolesArr should be an array filled with objects that have {role: x, manager: y} format.
// employeesArr should be an array filled with objects that have {employee: x, manager: y, role: z} format.
const addManager = function (
  rolesArr,
  employeesArr,
  role = "",
  previousAnswers = ""
) {
  let roleDefault;
  if (role) {
    roleDefault = rolesArr.find((elem) => elem.role === role);
  } else {
    roleDefault = rolesArr[0];
  }
  const employees = employeesArr.map((elem) => elem.employee);

  inquirer
    .prompt({
      name: "manager",
      type: "list",
      message: "Who will be the new employee's manager?",
      choices: employees,
      default: roleDefault.role,
    })
    .then((answers) => {
      if (previousAnswers) {
        previousAnswers.manager = answers;
        return previousAnswers;
      } else {
        return answers;
      }
    });
};
module.exports = addManager;
